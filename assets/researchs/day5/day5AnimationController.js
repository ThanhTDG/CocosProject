cc.Class({
	extends: cc.Component,

	properties: {
		skeleton: {
			default: null,
			type: sp.Skeleton,
		},
		prefabButton: {
			default: null,
			type: cc.Prefab,
			tooltip: "Prefab for button",
		},
		scrollView: {
			default: null,
			type: cc.ScrollView,
			tooltip: "ScrollView for buttons",
		},
	},

	onLoad() {
		this.instantiate();
	},
	instantiate() {
		let animations = this.getAllAnimations();
		animations.forEach((anim) => {
			let buttonNode = this.createButton(anim);
			this.scrollView.content.addChild(buttonNode);
		});
		this.scrollView.scrollToTop();
	},
	onClickAnimationButton(event) {
		if (!this.skeleton || !this.skeleton.skeletonData) {
			return;
		}
		this.skeleton.setAnimation(0, event, true);
	},
	createButton(anim) {
		let buttonNode = cc.instantiate(this.prefabButton);
		let button = buttonNode.getComponent(cc.Button);

		this.assignName(button, anim);
		this.assignClickEvent(button, anim);
		return buttonNode;
	},
	assignClickEvent(button, anim) {
		button.node.on(
			"click",
			() => {
				this.onClickAnimationButton(anim);
			},
			this
		);
	},
	assignName(button, name) {
		button.name = name;
		let label = button.getComponentInChildren(cc.Label);
		label.string = name;
	},

	getAllAnimations() {
		return this.skeleton._skeleton.data.animations.map((anim) => anim.name);
	},
});
