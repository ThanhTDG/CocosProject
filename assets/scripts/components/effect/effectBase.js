cc.Class({
	extends: cc.Component,

	properties: {
		effectType: {
			default: "",
			type: cc.String,
			tooltip: "Effect type identifier",
		},
		duration: {
			default: 1.0,
			type: cc.Float,
			tooltip: "Duration of the explosion effect",
		},
		animation: {
			default: null,
			type: cc.Animation,
			tooltip: "Animation component for the effect",
		},
	},

	playEffect() {
		this.onEffectStart();
		const animation = this.animation;
		if (animation) {
			this.playAnimation(animation);
		} else {
			this.customAnimation();
		}
	},

	playAnimation(animation) {
		animation.play();
	},

	customAnimation() {},
	stopCustomAnimation() {},

	destroyEffect() {
		if (this.animation) {
			this.animation.stop();
		}
		this.stopCustomAnimation();
		this.onEffectEnd();
		this.node.destroy();
	},

	onEffectStart() {},

	onEffectEnd() {},
});
