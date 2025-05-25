cc.Class({
	extends: cc.Component,

	properties: {
		labelRank: {
			default: null,
			type: cc.Label,
			tooltip: "Display rank of the player",
		},
		labelName: {
			default: null,
			type: cc.Label,
			tooltip: "Display name of the player",
		},
		labelScore: {
			default: null,
			type: cc.Label,
			tooltip: "Display score of the player",
		},
	},

	setData(data) {
		this.labelRank.string = data.rank;
		this.labelName.string = data.name;
		this.labelScore.string = data.score;
	},
});
