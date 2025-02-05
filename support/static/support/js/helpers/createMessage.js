import {createElement} from "./createElement.js";

/**
 * Создаёт DOM-элемент сообщения на основе переданного объекта сообщения.
 * @param {Object} messageObj - Объект сообщения.
 * @param {number} messageObj.id - ID сообщения.
 * @param {string} messageObj.created_at - Дата создания сообщения.
 * @param {"user" | "supp"} messageObj.sender - Отправитель сообщения.
 * @param {string} messageObj.text - Текст сообщения.
 * @param {boolean} messageObj.viewed - Флаг, указывающий, просмотрено ли сообщение.
 * @param {number} messageObj.ticket - ID тикета.
 * @returns {HTMLElement} - DOM-элемент сообщения.
 */
export function createMessage(messageObj) {
    const { sender, text, created_at } = messageObj;

    // Определяем классы в зависимости от отправителя
    const messageClasses = ["chat-message"];
    if (sender === "user") {
        messageClasses.push("user-message");
    } else if (sender === "supp") {
        messageClasses.push("support-message");
    }

    // Создаём элемент сообщения
    return createElement("div", {
        classes: messageClasses,
        children: [
            createElement("strong", {
                textContent: sender === "user" ? "Пользователь" : "Менеджер",
            }),
            createElement("p", {
                textContent: text,
            }),
            createElement("small", {
                textContent: new Date(created_at).toLocaleTimeString(),
            }),
        ],
    });
}