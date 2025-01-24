import { createElement } from "./createElement.js";
import { state } from "../state.js";
import { renderMessageList } from "./renderMessageList.js";

function handleClick(ticketId) {
    state.setCurrentChatId(ticketId);    
}

export function addTicketToList(ticketData) {
    const ticketList = document.querySelector(".ticket-list");
    const ticketElement = createElement("div", {
        classes: ["ticket"],
        attributes: { "data-ticket-id": ticketData.id },
        children: [
            createElement("h1", { textContent: ticketData.title }),
            createElement("small", { textContent: `Создан: ${new Date(ticketData.created_at).toLocaleString()}` }),
            createElement("div", { textContent: `Менеджер: ${ticketData.support_manager || "Не назначен"}` }),
        ],
    });
    const ticketId = ticketElement.getAttribute('data-ticket-id');
    console.log(ticketId)
    ticketElement.addEventListener("click", () => handleClick(ticketId));
    ticketList.appendChild(ticketElement);
}