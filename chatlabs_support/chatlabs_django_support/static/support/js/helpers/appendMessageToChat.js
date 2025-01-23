function appendMessageToChat(messageData) {
    const chatWindow = document.getElementById("chat-window");
    const messageElement = createMessage(messageData);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Прокрутка вниз
}