import { API_URL } from "./const/API_URL.js";
import { SOCKET_URL } from "./const/SOCKET_URL.js";
import { TICKETS_EVENTS } from "./const/TICKETS_EVENTS.js";
import { addTicketToList } from "./helpers/addTicketToList.js";
import { controller } from "./scripts/socketController.js";

// sockets
const ws = new WebSocket(SOCKET_URL)
ws.onclose = () => {
    console.log(`Соединение с ${SOCKET_URL} закрыто.`);
}
ws.onopen = () => {
    console.log(`Соединение с ${SOCKET_URL} установлено.`);

    fetch(API_URL+TICKETS_EVENTS.SEND.GET_TICKETS)
    .then(response => response.json()).then(data => data.forEach(item => addTicketToList(item)))
    .catch(error => console.error(error));
}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    controller(message, ws);
}
// sockets end




// html events
const sendMessageElement = document.querySelector("#send-message");
const messageTextArea = document.querySelector(".message-textarea");
const ticketAssignElement = document.querySelector("#ticket-assign");


ticketAssignElement.addEventListener("click", () => {
    controller({type: TICKETS_EVENTS.SEND.TICKET_ASSIGN}, ws);
})

sendMessageElement.addEventListener("click", () => {
    controller({type: TICKETS_EVENTS.SEND.TICKET_MESSAGE_NEW, text: messageTextArea.value}, ws);
    messageTextArea.value = "";
    messageTextArea.textContent = "";
})
// html events end