const { CharacterType } = require("./characterType");
const { EntityType } = require("../entityType");
const {
	isArrived,
	getMoveStepByDirection,
	getMoveStepToTarget,
	validateVector,
} = require("../../utils/vectorUtils");
const { Stats } = require("./stats");

cc.Class({
	extends: cc.Component,

	properties: {
		entityType: {
			type: cc.Enum(EntityType),
			default: EntityType.Character,
			tooltip: "Type of the entity (Character, Obstacle, etc.)",
		},
		characterType: {
			type: cc.Enum(CharacterType),
			default: CharacterType.Player,
			tooltip: "Type of the character (Player, Enemy, etc.)",
		},
	},
	update(dt) {
		this.updateMovement(dt);
	},
	setId(id) {
		this.id = id;
	},
	getId() {
		return this.id;
	},
	setStats(stats = new Stats()) {
		if (!(stats instanceof Stats)) {
			cc.error("Stats must be an instance of Stats class.");
			return;
		}
		this.stats = stats;
	},
	initialize(stats) {
		this.setStats(stats);
		this.isMoving = false;
		this.targetPosition = null;
		this.moveDirection = null;
	},
	setSprite(spriteFrame) {
		if (!(spriteFrame instanceof cc.SpriteFrame)) {
			cc.error("Sprite frame must be a cc.SpriteFrame object.");
			return;
		}
		let background = this.node.getChildByName("background");
		if (!background) {
			cc.error("Background node not found in character node.");
			return;
		}
		let sprite = background.getComponent(cc.Sprite);
		if (!sprite) {
			cc.error("Background node must have a cc.Sprite component.");
			return;
		}
		sprite.spriteFrame = spriteFrame;
	},
	moveTo(targetPosition) {
		this.targetPosition = targetPosition;
		this.isMoving = true;
	},
	onArrive() {
		this.isMoving = false;
	},
	moveByDirection(direction) {
		validateVector(direction);
		this.moveDirection = direction.normalize();
		this.isMoving = true;
	},
	canMove() {
		if (!this.isMoving) {
			return false;
		}
		if (!this.stats.speed) {
			return false;
		}
		return true;
	},
	updateMovement(dt) {
		if (!this.canMove()) {
			return;
		}
		let speed = this.stats.speed;
		const currentPosition = this.node.position;
		let moveStep = null;
		let nextPosition = null;

		if (this.targetPosition) {
			moveStep = getMoveStepToTarget(
				currentPosition,
				this.targetPosition,
				speed,
				dt
			);
			if (isArrived(currentPosition, this.targetPosition, moveStep)) {
				this.setPosition(this.targetPosition);
				this.onArrive();
				return;
			}
			nextPosition = currentPosition.add(moveStep);
		} else if (this.moveDirection) {
			moveStep = getMoveStepByDirection(this.moveDirection, speed, dt);
			if (moveStep.mag() < 0.01) {
				this.isMoving = false;
				this.moveDirection = null;
				return;
			}
			nextPosition = currentPosition.add(moveStep);
		}
		if (nextPosition) {
			this.setPosition(nextPosition);
		}
	},

	setPosition(position) {
		validateVector(position);
		this.node.setPosition(position);
	},
	onMove() {},
	onAttack() {},
	onDie() {},
	onHit() {},
});
