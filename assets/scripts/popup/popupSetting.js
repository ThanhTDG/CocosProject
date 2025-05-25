const { withClickEffect } = require("../sound/clickEffectWrapper");
const { getChildComponent } = require("../utils/componentUtils");
cc.Class({
	extends: require("popupItem"),
	properties: {},

	onLoad() {
		this._super();
		this.onClickLoadDefault = withClickEffect(this.onClickLoadDefault);
	},
	onClickLoadDefault() {
		this.loadSoundDefault();
	},
	loadSoundDefault() {
		let nodeSoundSetting = this.node.getChildByName("soundSetting");
		const soundItems = ["soundMaster", "soundMusic", "soundEffect"];
		soundItems.forEach((item) => {
			const soundItem = getChildComponent(
				nodeSoundSetting,
				item,
				"settingSoundItem"
			);
			if (soundItem) {
				soundItem.loadDefault();
			}
		});
	},
});
