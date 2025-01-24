export const state = {
    currentChatId: null,
    messages: [],
    setCurrentChatId: function(id) {
        this.currentChatId = id;
    },
    getCurrentChatId: function() {
        return this.currentChatId;
    },
    addMessage: function(message) {
        this.messages.push(message);
    }
}