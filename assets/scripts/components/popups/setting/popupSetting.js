const Emitter = require("../../../events/mEmitter");
const { withClickEffect } = require("../../../sound/effectWrapper");
const PopupEventKeys = require('../../../events/keys/popupEventKeys');
const SoundEventKeys = require('../../../events/keys/soundEventKeys');

cc.Class({
	extends: require("popupItem"),
	properties: {},

	onClickClosePopup() {
		withClickEffect(() => this.closePopup())();
	},
	onClickLoadDefault() {
		withClickEffect(() => this.loadDefaultSound())();
	},
	closePopup() {
		Emitter.instance.emit(PopupEventKeys.CLOSE_SETTING_POPUP);
	},

	loadDefaultSound() {
		Emitter.instance.emit(SoundEventKeys.LOAD_SOUND_DEFAULT);
	},
});