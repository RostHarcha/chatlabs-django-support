import { state } from "../state.js";

export function updateTicketAssignment(assignmentData) {
    if(assignmentData.id == state.getCurrentChatId()) {
        document.querySelector("#ticket-assign").disabled = true;
    }
}