const Emitter = require('./mEmitter');
export class EventManager {
    constructor() {
        this.mapEvent = new Map();
    }

    registerEvent(eventKey, eventHandler) {
        if (this.mapEvent.has(eventKey)) {
            throw new Error(`Event ${eventKey} is already registered.`);
        }
        Emitter.instance.registerEvent(eventKey, eventHandler);
        this.mapEvent.set(eventKey, eventHandler);
    }

    getEvent(eventKey) {
        return this.mapEvent.get(eventKey);
    }

    removeEvent(eventKey) {
        const eventHandler = this.mapEvent.get(eventKey);
        if (!eventHandler) {
            throw new Error(`Event ${eventKey} is not registered.`);

        }
        Emitter.instance.removeEvent(eventKey, eventHandler);
        this.mapEvent.delete(eventKey);
    }

    removeAllEvents() {
        for (const [eventKey, eventHandler] of this.mapEvent.entries()) {
            Emitter.instance.removeEvent(eventKey, eventHandler);
        }
        this.mapEvent.clear();
    }
}