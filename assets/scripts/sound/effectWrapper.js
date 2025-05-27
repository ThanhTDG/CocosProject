const Emitter = require("../events/mEmiter");
const SoundEventKeys = require("../events/keys/soundEventKeys");

export function withClickEffect(handler) {
	return function (...args) {
		Emitter.instance.emit(SoundEventKeys.PLAY_CLICK_SOUND);
		handler.apply(this, args);
	};
}
