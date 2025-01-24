let currentChatId = null;

export const setCurrentChatId = (id) => {
    currentChatId = id;
};

export const getCurrentChatId = () => {
    return currentChatId;
};