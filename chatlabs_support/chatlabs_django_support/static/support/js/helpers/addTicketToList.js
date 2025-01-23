import { createElement } from "./createElement.js";

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
    ticketList.appendChild(ticketElement);
}