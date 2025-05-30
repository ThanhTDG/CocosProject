cc.Class({
	extends: cc.Component,
	properties: {
		isActive: {
			default: false,
			tooltip: "state default popup item (default: false)",
		},
	},
	onLoad() {
		this.updateActiveState(this.isActive);
	},
	show() {
		this.updateActiveState(true);
	},
	hide() {
		this.updateActiveState(false);
	},
	updateActiveState(state) {
		this.node.active = state;
	},
});
