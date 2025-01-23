import { SOCKET_URL } from "./const/SOCKET_URL.js";
import { createMessage } from "./helpers/createMessage.js";
import { addTicketToList } from "./helpers/addTicketToList.js";
import {renderMessageList} from "./helpers/renderMessageList.js"

// const ws = new WebSocket(SOCKET_URL);

// ws.onopen = () => {
//     console.log(`Соединение с ${SOCKET_URL} установлено.`);
// };
// ws.onclose = () => {
//     console.log(`Соединение с ${SOCKET_URL} закрыто.`);
// }

const chatWindow = document.querySelector('.chat-window')

const newMsg = createMessage({
    "id": 31, // ID сообщения
    "created_at": "2024-12-29T16:08:04.267002Z", // дата создания
    "sender": "supp", // отправитель, "user" - пользователь, "supp" - менеджер
    "text": "some_text", // текст сообщения
    "viewed": true, // сообщение просмотрено
    "ticket": 16 // ID тикета
})


addTicketToList({
    "id": 21, // ID тикета
    "user": { // Информация о пользователе
        "telegram_id": 4 // telegram_id пользователя
    },
    "support_manager": null, // назначенный менеджер
    "created_at": "2024-12-29T16:10:38.620768Z", // дата создания
    "title": " have a probhave a probhave a prob" // заголовок тикета
})
addTicketToList({
    "id": 21, // ID тикета
    "user": { // Информация о пользователе
        "telegram_id": 4 // telegram_id пользователя
    },
    "support_manager": "maxim", // назначенный менеджер
    "created_at": "2024-12-29T16:10:38.620768Z", // дата создания
    "title": " have a new" // заголовок тикета
})

renderMessageList([{
    "id": 29, // ID сообщения
    "created_at": "2024-12-29T15:21:18.498325Z", // дата создания
    "sender": "user", // отправитель, "user" - пользователь, "supp" - менеджер
    "text": "jhklhjbkbklb", // текст сообщения
    "viewed": true, // сообщение просмотрено
    "ticket": 16 // ID тикета
}, {
    "id": 29, // ID сообщения
    "created_at": "2024-12-29T15:21:18.498325Z", // дата создания
    "sender": "user", // отправитель, "user" - пользователь, "supp" - менеджер
    "text": "jhklhjbkbklb", // текст сообщения
    "viewed": true, // сообщение просмотрено
    "ticket": 16 // ID тикета
}, {
    "id": 29, // ID сообщения
    "created_at": "2024-12-29T15:21:18.498325Z", // дата создания
    "sender": "supp", // отправитель, "user" - пользователь, "supp" - менеджер
    "text": "jhklhjbkbklb", // текст сообщения
    "viewed": true, // сообщение просмотрено
    "ticket": 16 // ID тикета
}])