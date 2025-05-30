const Emitter = require("../events/mEmitter");
const PopupEventKeys = require("../events/keys/popupEventKeys");
const { instantiatePrefab } = require("../utils/componentUtils");

const PopupName = {
	RANK: "popupRank",
	SETTING: "popupSetting",
}

cc.Class({
	extends: require('../events/eventController'),

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
		this._super();
		this.initialize();
	},
	initialize() {
		this.popupController = new PopupController(this.node);
		this.initializeRank();
		this.initializeSetting();
	},
	initializeEvents({ name, prefab, closeKey, openKey, componentName }) {
		let controller = this.popupController;
		controller.createPopup(name, prefab);
		this.registerEvent(openKey, controller.showPopup.bind(controller, name, componentName));
		this.registerEvent(closeKey, controller.hidePopup.bind(controller, name, componentName));
	},
	initializeRank() {
		this.initializeEvents({
			name: PopupName.RANK,
			componentName: PopupName.RANK,
			prefab: this.prefabRank,
			closeKey: PopupEventKeys.CLOSE_RANKING_POPUP,
			openKey: PopupEventKeys.OPEN_RANKING_POPUP
		});
	},
	initializeSetting() {
		this.initializeEvents({
			name: PopupName.SETTING,
			componentName: PopupName.SETTING,
			prefab: this.prefabSetting,
			closeKey: PopupEventKeys.CLOSE_SETTING_POPUP,
			openKey: PopupEventKeys.OPEN_SETTING_POPUP
		});
	}

});


class PopupController {

	constructor(rootNode) {
		if (!rootNode) {
			throw new Error("Root node is required for PopupController.");
		}
		this.activePopup = null;
		this.rootNode = rootNode;
		this.popupMap = new Map();
	}

	createPopup(popupName, popupPrefab) {
		if (this.popupMap.has(popupName)) {
			throw new Error(`Popup ${popupName} is already created.`);
		}
		const node = instantiatePrefab(popupPrefab, this.rootNode, popupName);
		this.popupMap.set(popupName, node);
		return node;
	}

	registerEvent(key, registerEvent, func) {
		if (!registerEvent || typeof registerEvent !== 'function') {
			throw new Error("registerEvent must be a function.");
		}
		registerEvent(key, func);
	}

	getPopup(popupName) {
		if (!this.popupMap.has(popupName)) {
			throw new Error(`Popup ${popupName} is not created.`);
		}
		return this.popupMap.get(popupName);
	}

	showPopup(popupName, componentName) {
		const popupNode = this.getPopup(popupName);
		if (!popupNode) {
			throw new Error(`Popup ${popupName} is not created.`);
		}
		if (this.activePopup === null) {
			this.activePopup = popupName;
			popupNode.getComponent(componentName).show();
		}
	}
	hidePopup(popupName, componentName) {
		const popupNode = this.getPopup(popupName);
		if (!popupNode) {
			throw new Error(`Popup ${popupName} is not created.`);
		}
		if (this.activePopup !== popupName) {
			return;
		}
		this.activePopup = null;
		popupNode.getComponent(componentName).hide();
	}
}
