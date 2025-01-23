import {TICKETS_EVENTS} from "../const/TICKETS_EVENTS.js"


// функциия для отправки запросов
export function assignTicket(ticketId) {
    socket.emit(TICKETS_EVENTS.SEND.TICKET_ASSIGN, {
        type: TICKETS_EVENTS.SEND.TICKET_ASSIGN,
        id: ticketId,
    });
}

export function markMessageAsViewed(ticketId, messageId) {
    socket.emit(TICKETS_EVENTS.SEND.TICKET_MESSAGE_VIEWED, {
        type: TICKETS_EVENTS.SEND.TICKET_MESSAGE_VIEWED,
        ticket_id: ticketId,
        message_id: messageId,
    });
}

export function sendMessage(ticketId, text) {
    socket.emit(TICKETS_EVENTS.SEND.TICKET_MESSAGE_NEW, {
        type: TICKETS_EVENTS.SEND.TICKET_MESSAGE_NEW,
        ticket_id: ticketId,
        text: text,
    });
}

export function requestMessageList(ticketId) {
    socket.emit(TICKETS_EVENTS.SEND.TICKET_MESSAGE_LIST, {
        type: TICKETS_EVENTS.SEND.TICKET_MESSAGE_LIST,
        ticket_id: ticketId,
    });
}
// функции для обработки принятых запросов

function handleTicketCreated(ticketData) {
    console.log("Новый тикет создан:", ticketData);
    // Добавить тикет в список
    addTicketToList(ticketData);
}

function handleTicketAssigned(assignmentData) {
    console.log("Тикет назначен:", assignmentData);
    // Обновить информацию о назначении тикета
    updateTicketAssignment(assignmentData);
}

function handleMessageViewed(messageData) {
    console.log("Сообщение просмотрено:", messageData);
    // Обновить статус сообщения в интерфейсе
    updateMessageViewStatus(messageData.message.id);
}

function handleNewMessage(messageData) {
    console.log("Новое сообщение:", messageData);
    // Добавить сообщение в чат
    appendMessageToChat(messageData.message);
}

function handleMessageList(messageListData) {
    console.log("Список сообщений:", messageListData);
    // Очистить чат и отобразить список сообщений
    renderMessageList(messageListData.messages);
}