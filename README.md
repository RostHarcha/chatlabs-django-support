# Закладки
- [ChatLabs Support](#chatlabs-support)
    - [Aiogram Support](#chatlabs-aiogram-support)
        - [Установка](#chatlabs-aiogram-support---установка)
    - [Django Support](#chatlabs-django-support)
        - [Установка](#chatlabs-django-support---установка)
        - [Отправляемые сообщения](#chatlabs-django-support---отправляемые-сообщения)
        - [Получаемые сообщения](#chatlabs-django-support---Получаемые-сообщения)

# ChatLabs Support

## ChatLabs Aiogram Support

### ChatLabs Aiogram Support - Установка

`pip install chatlabs-support[chatlabs_aiogram_support]`

Необходимые переменные окружения:
- `BACKEND_SCHEMA`
- `BACKEND_HOST`
- `BACKEND_PORT`

Добавление роутера поддержки в диспетчер:
```python
from aiogram import Dispatcher

from chatlabs_support import chatlabs_aiogram_support as support

dp = Dispatcher()

dp.include_router(support.dialog_router)
```

Добавление кнопки поддержки в окно:
```python
from aiogram_dialog import Dialog, Window
from aiogram_dialog.widgets.kbd import Start
from aiogram_dialog.widgets.text import Const

from chatlabs_support import chatlabs_aiogram_support as support

Dialog(
    ...,
    Window(
        ...,
        Start(
            text=Const('Поддержка'),
            id='support',
            state=support.main_state,
        ),
        ...,
    ),
    ...,
)
```

Альтернативный вариант:
```python
from aiogram_dialog import Dialog, Window

from chatlabs_support import chatlabs_aiogram_support as support

Dialog(
    ...,
    Window(
        ...,
        support.SupportStartButton,
        ...,
    ),
    ...,
)
```

## ChatLabs Django Support

### ChatLabs Django Support - Установка

`pip install chatlabs-support[chatlabs_django_support]`

Для привязки тикетов необходимо определить модель пользователя
```python
# myapp/models.py

class MyUser(models.Model):
    telegram_id = models.BigIntegerField(
        primary_key=True,
        unique=True,
    )
    ...
```
Обратите внимание, что наличие в этой модели поля
telegram_id (PK, Unique) - обязательно

```python
# django_project/settings.py

INSTALLED_APPS = [
    'daphne',
    'channels',
    ...,
    'myapp',
    'chatlabs_support.chatlabs_django_support',
]

ASGI_APPLICATION = 'django_project.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

SUPPORT_TELEGRAM_USER_MODEL = 'myapp.MyUser'
```

```python
# django_project/asgi.py

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from chatlabs_support.chatlabs_django_support.routing import ws_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'example_project.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(URLRouter(ws_urlpatterns)),
})
```

```python
# django_project/urls.py

urlpatterns = [
    ...,
    path('support/', include('chatlabs_support.chatlabs_django_support.urls')),
]
```

### ChatLabs Django Support - API

---

GET "/support/tickets/"

Получить список тикетов

**Query params**:
- `user_id` (number) - ID Пользователя (создателя тикета)
- `resolved` (bool) - `true` - тикет решен, `false` - тикет не решен
- `manager` (number) - ID менеджера, на которого назначены тикеты
- `manager__isnull` (bool) - `true` - менеджер не назначен, `false` - менеджер назначен

**Response**:
```json
[
    {
        "id": 2,
        "user": {
            "telegram_id": 123
        },
        "support_manager": null,
        "created_at": "2025-01-31T12:24:25.716425Z",
        "title": "I've founded some bug",
        "resolved": false
    }
]
```

---

GET "/support/tickets/`ticket_id`/"

Получить тикет

**Response**:
```json
{
    "id": 1,
    "user": {
        "telegram_id": 123
    },
    "support_manager": {
        "id": 1,
        "first_name": "",
        "last_name": ""
    } || null,
    "created_at": "2025-01-22T12:11:40.273325Z",
    "title": "I've founded some bug",
    "resolved": true
}
```

---

GET "/support/tickets/`ticket_id`/messages/"

Получить список сообщений в тикете

**Response**:
```json
[
    {
        "id": 3,
        "created_at": "2025-01-31T12:18:03.929086Z",
        "sender": "user" || "supp",
        "text": "some text of message",
        "viewed": false,
        "ticket": 1
    }
]
```

---

### ChatLabs Django Support - Отправляемые сообщения

---

Принять тикет в работу:
```json
{
    "type": "ticket.assign",
    "ticket_id": 16 // ID тикета
}
```

---

Отправить сообщение:
```json
{
    "type": "ticket.message.new",
    "ticket_id": 16, // ID тикета
    "text": "The is some text" // текст сообщения
}
```

---

### ChatLabs Django Support - Получаемые сообщения

---

Создан новый тикет:
```json
{
    "type": "ticket.created",
    "ticket": {
        "id": 21, // ID тикета
        "user": { // Информация о пользователе
            "telegram_id": 4 // telegram_id пользователя
        },
        "support_manager": null, // назначенный менеджер
        "created_at": "2024-12-29T16:10:38.620768Z", // дата создания
        "title": "have a prob" // заголовок тикета
    }
}
```

---

Тикет назначен:
```json
{
    "type": "ticket.assigned",
    "id": 16, // ID тикета
    "support_manager": 1, // ID менеджера
}
```

---

Новое сообщение:
```json
{
    "type": "ticket.message.new",
    "message": {
        "id": 31, // ID сообщения
        "created_at": "2024-12-29T16:08:04.267002Z", // дата создания
        "sender": "supp", // отправитель, "user" - пользователь, "supp" - менеджер
        "text": "some_text", // текст сообщения
        "viewed": true, // сообщение просмотрено
        "ticket": 16 // ID тикета
    }
}
```

---
