import { createElement } from "./createElement.js";
import { state } from "../state.js";
import { renderMessageList } from "./renderMessageList.js";
import { getTicketMessages } from "../scripts/apiController.js";

function handleClick(ticket) {
    state.setCurrentChatId(ticket.id);
    getTicketMessages(ticket.id);
    document.querySelector("#ticket-title").textContent = ticket.title;
    document.querySelector("#ticket-assign").disabled = Boolean(ticket.support_manager);
}

export function addTicketToList(ticketData) {
    const ticketList = document.querySelector(".ticket-list");
    const ticketElement = createElement("div", {
        classes: ["ticket"],
        attributes: { "data-ticket-id": ticketData.id },
        children: [
            createElement("h1", { textContent: ticketData.title }),
            createElement("small", { textContent: `Создан: ${new Date(ticketData.created_at).toLocaleString()}` }),
            createElement("div", { textContent: `Менеджер: ${ticketData.support_manager?.first_name ?? "Не назначен"}` }),
        ],
    });
    // const ticketId = ticketElement.getAttribute('data-ticket-id');
    ticketElement.addEventListener("click", () => handleClick(ticketData));
    ticketList.appendChild(ticketElement);
}