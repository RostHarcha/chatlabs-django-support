import { createElement } from "./createElement.js";
import { state } from "../state.js";
import { getTicketMessages } from "../scripts/apiController.js";
import { btnSetMyTicketsElement, btnSetUnassignedTicketsElement, managerIdElement, ticketAssignElement, ticketTitleElement } from "../const/ELEMENTS.js";

function handleClick(ticket) {
    state.setCurrentChatId(ticket.id);
    getTicketMessages(ticket.id);
    ticketTitleElement.textContent = ticket.title;
    ticketAssignElement.disabled = Boolean(ticket.support_manager);
    ticketAssignElement.value = ticketAssignElement.disabled ? "Принят в работу" : "Принять в работу";
}

export function addTicketToList(ticketData) {
    if(ticketData.support_manager && ticketData.support_manager?.id != managerIdElement.textContent) return;
    if(!ticketData.support_manager && !btnSetUnassignedTicketsElement.disabled) return;
    if(ticketData.support_manager && !btnSetMyTicketsElement.disabled) return;
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