const EventEmitter = require('events');
class mEmitter {
    static _instance = null;
    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(100);
    }
    static get instance() {
        if (!mEmitter._instance) {
            mEmitter._instance = new mEmitter();
        }
        return mEmitter._instance;
    }
    emit(...agrs) {
        this.emitter.emit(...agrs);
    }
    regiterEvent(event, listener) {
        this.emitter.on(event, listener);
    }
    regiterOnceEvent(event, listener) {
        this.emitter.once(event, listener);
    }
    removeEvent(event, listener) {
        this.emitter.removeListener(event, listener);
    }
    destroy() {
        this.emitter.removeAllListeners();
        this.emitter = null;
        mEmitter._instance = null;
    }
}
module.exports = mEmitter;