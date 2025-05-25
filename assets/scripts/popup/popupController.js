const { withClickEffect } = require("../sound/clickEffectWrapper");

cc.Class({
	extends: cc.Component,

	properties: {
		prefabSetting: {
			default: null,
			type: cc.Prefab,
			tooltip: "Prefab for popup setting",
		},
		prefabRank: {
			default: null,
			type: cc.Prefab,
			tooltip: "Prefab for popup rank",
		},
	},

	onLoad() {
		this.activePopup = null;

		this.popupSetting = this.createPopup(this.prefabSetting, "popupSetting");
		this.popupRank = this.createPopup(this.prefabRank, "popupRank");

		this.onClickShowRank = withClickEffect(this.onClickShowRank.bind(this));
		this.onClickHideRank = withClickEffect(this.onClickHideRank.bind(this));
		this.onClickShowSetting = withClickEffect(
			this.onClickShowSetting.bind(this)
		);
		this.onClickHideSetting = withClickEffect(
			this.onClickHideSetting.bind(this)
		);
	},

	createPopup(prefab, componentName) {
		const node = cc.instantiate(prefab);
		node.parent = this.node;
		return node.getComponent(componentName);
	},

	showPopup(popup) {
		if (this.activePopup && this.activePopup !== popup) {
			return;
		}

		if (!this.activePopup) {
			this.activePopup = popup;
			popup.show();
		}
	},

	hidePopup(popup) {
		if (this.activePopup === popup) {
			popup.hide();
			this.activePopup = null;
		}
	},

	onClickShowRank() {
		this.showPopup(this.popupRank);
	},

	onClickHideRank() {
		this.hidePopup(this.popupRank);
	},

	onClickShowSetting() {
		this.showPopup(this.popupSetting);
	},

	onClickHideSetting() {
		this.hidePopup(this.popupSetting);
	},
});
