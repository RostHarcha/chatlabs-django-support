import { TICKETS_EVENTS } from "../const/TICKETS_EVENTS.js";
import { addTicketToList } from "../helpers/addTicketToList.js";
import { state } from "../state.js";



export function controller(message, ws) {
    switch (message.type) {
        case TICKETS_EVENTS.RECEIVE.TICKET_CREATED:
            addTicketToList(message.ticket);
            break;
        case TICKETS_EVENTS.RECEIVE.TICKET_MESSAGE_NEW:
            if(message.message.ticket === state.currentChatId) {
                state.addMessage(message.message);
                renderMessageList(state.messages);
            }
            break;
        case TICKETS_EVENTS.SEND.TICKET_ASSIGN:
            ws.send(JSON.stringify({
                type: TICKETS_EVENTS.SEND.TICKET_ASSIGN,
                ticket_id: state.getCurrentChatId()
            }));
            break;
    }
}