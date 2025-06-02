const PopupEventKeys = require("../../../events/keys/popupEventKeys");
const Emitter = require("../../../events/mEmitter");
const { withClickEffect } = require("../../../sound/effectWrapper");


const dataList = [
	{ rank: 1, name: "Player 1", score: 1000 },
	{ rank: 2, name: "Player 2", score: 950 },
	{ rank: 3, name: "Player 3", score: 900 },
	{ rank: 4, name: "Player 4", score: 850 },
	{ rank: 5, name: "Player 5", score: 800 },
	{ rank: 6, name: "Player 6", score: 750 },
	{ rank: 7, name: "Player 7", score: 700 },
	{ rank: 8, name: "Player 8", score: 650 },
	{ rank: 9, name: "Player 9", score: 600 },
	{ rank: 10, name: "Player 10", score: 550 },
];

const MAX_ITEM_COUNT = 5;

cc.Class({
	extends: require("popupItem"),

	properties: {
		layoutNode: {
			default: null,
			type: cc.Node,
			tooltip: "Node containing the rank items",
		},
		itemPrefab: {
			default: null,
			type: cc.Prefab,
			tooltip: "Prefab for each rank item",
		},
		maxItem: {
			default: MAX_ITEM_COUNT,
			tooltip: "Maximum number of items to display in the rank list",
		},
	},

	onLoad() {
		this._super();
		this.itemPool = [];
		this.initItemPool(this.maxItem);
	},

	show() {
		this._super();
		this.populateList(dataList);
	},
	onClickClosePopup() {
		withClickEffect(() => this.closePopup())();
	},
	initItemPool(count) {
		for (let i = 0; i < count; i++) {
			const item = this.createItem();
			this.itemPool.push(item);
		}
	},

	populateList(dataList) {
		const count = Math.min(dataList.length, this.itemPool.length);

		for (let i = 0; i < count; i++) {
			this.updateItem(this.itemPool[i], dataList[i]);
		}

		for (let i = count; i < this.itemPool.length; i++) {
			this.itemPool[i].active = false;
		}
	},

	createItem() {
		const item = cc.instantiate(this.itemPrefab);
		item.parent = this.layoutNode;
		return item;
	},

	updateItem(item, data) {
		const itemComponent = item.getComponent("rankItem");
		if (itemComponent) {
			itemComponent.setData(data);
		}
		item.active = true;
	},
	closePopup() {
		Emitter.instance.emit(PopupEventKeys.CLOSE_RANKING_POPUP);
	},


});
