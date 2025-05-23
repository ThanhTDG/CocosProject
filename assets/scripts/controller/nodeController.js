const randomUtils = require("../utils/randomUtils");
const positionUtils = require("../utils/positionUtils");
cc.Class({
	extends: cc.Component,

	properties: {
		speed: {
			default: 100,
			type: cc.Float,
		},
		colorChangeInterval: {
			default: 2,
			type: cc.Float,
		},
		scaleSpeed: {
			default: 0.5,
			type: cc.Float,
		},
		maxScale: {
			default: 2,
			type: cc.Float,
		},
		minScale: {
			default: 0.5,
			type: cc.Float,
		},
		rotationSpeed: {
			default: 90,
			type: cc.Float,
		},
		opacityChangeSpeed: {
			default: 100,
			type: cc.Float,
		},
	},

	onLoad() {
		this.angle = 0;
		this.scaleDirection = 1;
		this.colorChangeTimer = 0;
		this.opacityChangeTimer = 0;
	},

	start() {
		this.originalPosition = this.node.position;
	},

	update(dt) {
		this._moveInCircle(dt);
		this._changeColor(dt);
		this._scaleNode(dt);
		this._rotateNode(dt);
		this._changeOpacity(dt);
	},

	_moveInCircle(dt) {
		this.angle += this.speed * dt;
		let radius = 100;
		const { x, y } = positionUtils.calculateCircularPosition(
			this.originalPosition,
			radius,
			this.angle
		);
		this.node.setPosition(x, y);
	},

	_changeColor(dt) {
		this.colorChangeTimer += dt;
		let canChangeColor = this.colorChangeTimer >= this.colorChangeInterval;
		if (!canChangeColor) {
			return;
		}
		this._resetColorChangeTimer();
		this._changeRandomNodeColor();
	},

	_resetColorChangeTimer() {
		this.colorChangeTimer = 0;
	},

	_changeRandomNodeColor() {
		this.node.color = randomUtils.ccColor();
	},

	_changeOpacity(dt) {
		let currentOpacity = this.node.opacity;
		currentOpacity = this.opacityIncreasing
			? this._increaseOpacity(currentOpacity, dt)
			: this._decreaseOpacity(currentOpacity, dt);
		this.node.opacity = currentOpacity;
	},

	_increaseOpacity(currentOpacity, dt) {
		const MAX_OPACITY = 255;
		currentOpacity += this.opacityChangeSpeed * dt;
		if (currentOpacity >= MAX_OPACITY) {
			currentOpacity = MAX_OPACITY;
			this.opacityIncreasing = false;
		}
		return currentOpacity;
	},

	_decreaseOpacity(currentOpacity, dt) {
		const MIN_OPACITY = 0;
		currentOpacity -= this.opacityChangeSpeed * dt;
		if (currentOpacity <= MIN_OPACITY) {
			currentOpacity = MIN_OPACITY;
			this.opacityIncreasing = true;
		}
		return currentOpacity;
	},
	_rotateNode(dt) {
		let newAngle = this.rotationSpeed * dt;
		this.node.angle += newAngle;
	},

	_scaleNode(dt) {
		let currentScale = this.node.scale;
		currentScale += this.scaleDirection * this.scaleSpeed * dt;

		if (currentScale > this.maxScale) {
			currentScale = this.maxScale;
			this.scaleDirection = -1;
		} else if (currentScale < this.minScale) {
			currentScale = this.minScale;
			this.scaleDirection = 1;
		}

		this.node.scale = currentScale;
	},
});
