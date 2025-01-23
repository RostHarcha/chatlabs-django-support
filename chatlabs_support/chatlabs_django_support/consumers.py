from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import BaseChannelLayer, get_channel_layer
from django.contrib.auth.models import User

from . import models, serializers


class BaseChatConsumer(AsyncJsonWebsocketConsumer):
    unassigned_tickets_group = 'unassigned_tickets'

    @staticmethod
    def ticket_messages_group(ticket_id: int) -> str:
        return f'ticket_{ticket_id}_messages'

    @classmethod
    def get_channel_layer(cls) -> BaseChannelLayer:
        return get_channel_layer(cls.channel_layer_alias)

    @property
    def _channel_layer(self) -> BaseChannelLayer:
        return self.channel_layer

    async def add_to_group(self, group_name: str):
        await self._channel_layer.group_add(group_name, self.channel_name)

    async def remove_from_group(self, group_name: str):
        await self._channel_layer.group_discard(group_name, self.channel_name)

    async def add_ticket_to_group(self, ticket_id):
        group_name = self.ticket_messages_group(ticket_id)
        await self.add_to_group(group_name)
        self.ticket_messages_groups_set.add(group_name)

    async def remove_ticket_from_group(self, ticket_id):
        group_name = self.ticket_messages_group(ticket_id)
        await self.remove_from_group(group_name)
        self.ticket_messages_groups_set.discard(group_name)

    @database_sync_to_async
    def get_ticket_ids(self):
        return list(
            models.Ticket.objects.filter(
                support_manager=self.manager
            ).values_list('id', flat=True)
        )

    async def connect(self):
        self.ticket_messages_groups_set = set()
        try:
            self.manager = await User.objects.aget(pk=self.scope['user'].pk)
        except (User.DoesNotExist, AttributeError, KeyError):
            return await self.close()
        await self.add_to_group(self.unassigned_tickets_group)
        for ticket_id in await self.get_ticket_ids():
            await self.add_ticket_to_group(ticket_id)
        await self.accept()

    async def disconnect(self, code):  # noqa: ARG002
        await self.remove_from_group(self.unassigned_tickets_group)
        for ticket_id in self.ticket_messages_groups_set:
            await self.remove_ticket_from_group(ticket_id)


class ChatConsumerSerializerMixin:
    @database_sync_to_async
    def serialize_message(self, message: models.Message) -> dict:
        return serializers.Message(message).data

    @database_sync_to_async
    def serialize_messages(self, ticket_id: int) -> list[dict]:
        return serializers.Message(
            models.Message.objects.filter(
                ticket__id=ticket_id,
            ).order_by('-created_at'),
            many=True,
        ).data


class ChatConsumerSender(ChatConsumerSerializerMixin, BaseChatConsumer):
    async def ticket_created(self, event: dict):
        event['ticket'] = serializers.Ticket(event['ticket']).data
        await self.send_json(event)

    async def ticket_assigned(self, event: dict):
        await self.send_json(event)

    async def ticket_message_viewed(self, event: dict):
        event['message'] = await self.serialize_message(event['message'])
        await self.send_json(event)

    async def ticket_message_new(self, event: dict):
        event['message'] = await self.serialize_message(event['message'])
        await self.send_json(event)

    async def ticket_message_list(self, event: dict):
        event['messages'] = await self.serialize_messages(event['ticket_id'])
        await self.send_json(event)


class ChatConsumerReceiver(BaseChatConsumer):
    async def _receive_ticket_assign(self, *, ticket_id: int):
        try:
            ticket = await models.Ticket.objects.aget(
                id=ticket_id,
            )
        except models.Ticket.DoesNotExist:
            return None, None
        ticket.support_manager = self.manager
        await ticket.asave()
        await self.add_ticket_to_group(ticket.id)
        return (
            self.unassigned_tickets_group,
            {
                'type': 'ticket.assigned',
                'id': ticket.id,
                'support_manager': self.manager.pk,
            },
        )

    async def _receive_ticket_message_viewed(
        self,
        *,
        ticket_id: int,
        message_id: int,
    ):
        message = await models.Message.objects.aget(
            ticket__id=ticket_id,
            id=message_id,
        )
        message.viewed = True
        await message.asave()
        return (
            self.ticket_messages_group(ticket_id),
            {
                'type': 'ticket.message.viewed',
                'message': message,
            },
        )

    async def _receive_ticket_message_new(self, *, ticket_id: int, text: str):
        try:
            ticket = await models.Ticket.objects.aget(
                id=ticket_id,
            )
        except models.Ticket.DoesNotExist:
            return None, None
        message = await models.Message.objects.acreate(
            ticket=ticket,
            sender=models.Message.Sender.SUPPORT_MANAGER,
            text=text,
            viewed=True,
        )
        return (
            self.ticket_messages_group(ticket.id),
            {
                'type': 'ticket.message.new',
                'message': message,
            },
        )

    async def _receive_ticket_message_list(self, *, ticket_id: int):
        return (
            self.ticket_messages_group(ticket_id),
            {
                'type': 'ticket.message.list',
                'ticket_id': ticket_id,
            },
        )

    async def none_handler(self, *_, **__):
        return None, None


class ChatConsumer(ChatConsumerReceiver, ChatConsumerSender):
    async def get_group_and_message(
        self, content: dict
    ) -> tuple[str, dict] | tuple[None, None]:
        handler = {
            'ticket.assign': self._receive_ticket_assign,
            'ticket.message.viewed': self._receive_ticket_message_viewed,
            'ticket.message.new': self._receive_ticket_message_new,
            'ticket.message.list': self._receive_ticket_message_list,
        }.get(
            content.pop('type', None),
            self.none_handler,
        )
        return await handler(**content)

    async def receive_json(self, content: dict, **_):
        group, message = await self.get_group_and_message(content)
        if all([group, message]):
            await self._channel_layer.group_send(
                group,
                message,
            )
