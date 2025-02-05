import { API_URL } from "./const/API_URL.js";
import { btnSetMyTicketsElement, btnSetUnassignedTicketsElement, managerIdElement, messageTextAreaElement, sendMessageElement, ticketAssignElement } from "./const/ELEMENTS.js";
import { SOCKET_URL } from "./const/SOCKET_URL.js";
import { TICKETS_EVENTS } from "./const/TICKETS_EVENTS.js";
import { addTicketToList } from "./helpers/addTicketToList.js";
import { getTickets } from "./scripts/apiController.js";
import { controller } from "./scripts/socketController.js";

// sockets
const ws = new WebSocket(SOCKET_URL)
ws.onclose = () => {
    console.log(`Соединение с ${SOCKET_URL} закрыто.`);
}
ws.onopen = () => {
    console.log(`Соединение с ${SOCKET_URL} установлено.`);
    getTickets()
}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    controller(message, ws);
}
// sockets end


// html events
ticketAssignElement.addEventListener("click", () => {
    controller({type: TICKETS_EVENTS.SEND.TICKET_ASSIGN}, ws);
})

sendMessageElement.addEventListener("click", () => {
    controller({type: TICKETS_EVENTS.SEND.TICKET_MESSAGE_NEW, text: messageTextAreaElement.value}, ws);
    messageTextAreaElement.value = "";
    messageTextAreaElement.textContent = "";
})

btnSetUnassignedTicketsElement.addEventListener("click", () => {
    getTickets();
})

btnSetMyTicketsElement.addEventListener("click", () => {
    getTickets(managerIdElement.textContent);
})
// html events end