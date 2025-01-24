import { SOCKET_URL } from "./const/SOCKET_URL.js";
import { TICKETS_EVENTS } from "./const/TICKETS_EVENTS.js";
import { controller } from "./scripts/socketContoller.js";


const ws = new WebSocket(SOCKET_URL)

ws.onclose = () => {
    console.log(`Соединение с ${SOCKET_URL} закрыто.`);
}
ws.onopen = () => {
    console.log(`Соединение с ${SOCKET_URL} установлено.`);
}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    controller(message, ws);
}

const ticketAssignElement = document.querySelector("#ticket-assign");

ticketAssignElement.addEventListener("click", () => {
    controller({type: TICKETS_EVENTS.SEND.TICKET_ASSIGN}, ws);
})