import { createMessage } from "./createMessage.js";
export function renderMessageList(messages) {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML = ""; // Очистка чата

    messages.forEach((message) => {
        const messageElement = createMessage(message);
        chatWindow.appendChild(messageElement);
    });

    chatWindow.scrollTop = chatWindow.scrollHeight; // Прокрутка вниз
}