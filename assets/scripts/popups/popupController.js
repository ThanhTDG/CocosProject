const Emitter = require("../events/mEmiter");
const PopupEventKeys = require("../events/keys/popupEventKeys");
const { PopupName } = require("./popupType");

class PopupEventManager {
	constructor() {
		this.eventMap = new Map();
	}

	add(eventKey, handler) {
		let hasEvent = this.eventMap.has(eventKey);
		if (!hasEvent) {
			this.eventMap.set(eventKey, handler);
			Emitter.instance.regiterEvent(eventKey, handler);
		}
	}

	remove(eventKey) {
		const handler = this.eventMap.get(eventKey);
		if (handler) {
			Emitter.instance.removeEvent(eventKey, handler);
			this.eventMap.delete(eventKey);
		}
	}

	removeAll() {
		for (const [eventKey, handler] of this.eventMap.entries()) {
			Emitter.instance.removeEvent(eventKey, handler);
		}
		this.eventMap.clear();
	}
}

class PopupManager {
	constructor() {
		this.popups = new Map();
		this.activePopup = null;
	}
	addPopup(name, popupInstance) {
		this.popups.set(name, popupInstance);
	}
	show(name) {
		if (this.activePopup === name) {
			return;
		}
		if (this.activePopup) this.hide(this.activePopup);
		const popup = this.popups.get(name);
		if (popup) {
			popup.show();
			this.activePopup = name;
		}
	}
	hide(name) {
		if (this.activePopup !== name) {
			return;
		}
		const popup = this.popups.get(name);
		if (popup) {
			popup.hide();
			this.activePopup = null;
		}
	}
}

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
		this.popupManager = new PopupManager();
		this.eventManager = new PopupEventManager();

		const popupConfigs = this.getPopupConfigs();
		this.initializePopups(popupConfigs);
		this.registerPopupEvents(popupConfigs);
	},

	onDestroy() {
		this.eventManager.removeAll();
	},

	getPopupConfigs() {
		return [
			{
				name: PopupName.SETTING,
				prefabProp: "prefabSetting",
				componentName: PopupName.SETTING,
				openEvent: PopupEventKeys.OPEN_SETTING_POPUP,
				closeEvent: PopupEventKeys.CLOSE_SETTING_POPUP,
			},
			{
				name: PopupName.RANK,
				prefabProp: "prefabRank",
				componentName: PopupName.RANK,
				openEvent: PopupEventKeys.OPEN_RANKING_POPUP,
				closeEvent: PopupEventKeys.CLOSE_RANKING_POPUP,
			},
		];
	},

	initializePopups(configs) {
		configs.forEach(config => {
			const prefab = this[config.prefabProp];
			const popup = this.createPopup(prefab, config.componentName);
			this.popupManager.addPopup(config.name, popup);
		});
	},

	registerPopupEvents(configs) {
		configs.forEach(config => {
			this.eventManager.add(config.openEvent, () => this.popupManager.show(config.name));
			this.eventManager.add(config.closeEvent, () => this.popupManager.hide(config.name));
		});
	},

	createPopup(prefab, componentName) {
		const node = cc.instantiate(prefab);
		node.parent = this.node;
		return node.getComponent(componentName);
	}
});

