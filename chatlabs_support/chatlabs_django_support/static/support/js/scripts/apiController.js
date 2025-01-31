import { API_URL } from "../const/API_URL.js";
import { TICKETS_EVENTS } from "../const/TICKETS_EVENTS.js";
import { renderMessageList } from "../helpers/renderMessageList.js";
import { state } from "../state.js";

export function getTicketMessages(ticketId) {
    fetch(API_URL+TICKETS_EVENTS.SEND.GET_TICKET_MESSAGES(ticketId))
    .then(response => response.json()).then(data => {
        data.reverse();
        data.forEach((item) => state.addMessage(item))
        renderMessageList(state.getMessages());
    })
    .catch(error => console.error(error));
}