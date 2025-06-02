const { EventManager } = require("./eventManager");
cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad() {
        this.eventManager = new EventManager();
        this.registerEvents();
    },
    onDestroy() {
        this.removeAllEvents();
    },
    registerEvents() {

    },
    registerEvent(eventKey, eventHandler) {
        this.eventManager.registerEvent(eventKey, eventHandler);
    },
    getEvent(eventKey) {
        return this.eventManager.getEvent(eventKey);
    },
    removeEvent(eventKey) {
        this.eventManager.removeEvent(eventKey);
    },
    removeAllEvents() {
        this.eventManager.removeAllEvents();
    },
});