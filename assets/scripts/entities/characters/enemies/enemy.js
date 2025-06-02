const { CharacterType } = require("../characterType");
const { EnemyType } = require("./enemyType");
const { EntityGroup } = require("../../entityType");
const EnemyEventKeys = require("../../../events/keys/enemyEventKeys");
const CharacterBase = require("../characterBase");
const Emitter = require("../../../events/mEmitter");
const { EntityCollision } = require("../../entityCollision");
cc.Class({
	extends: CharacterBase,
	properties: {
		characterType: {
			type: cc.Enum(CharacterType),
			default: CharacterType.Enemy,
			override: true,
			tooltip: "Type of the character (Player, Enemy, etc.)",
		},
		enemyType: {
			type: cc.Enum(EnemyType),
			default: EnemyType.Normal,
			tooltip: "Type of the enemy (Normal, Boss, etc.)",
		},
	},
	startMove() {
		this.moveLeft();
		this.startWalkAnimation();
	},
	startWalkAnimation() {
		this.background = this.node.getChildByName("background");
		this.walkTween = cc
			.tween(this.background)
			.repeatForever(
				cc
					.tween()
					.to(0.3, { scaleY: 1.1 }, { easing: "sineInOut" })
					.to(0.3, { scaleY: 0.9 }, { easing: "sineInOut" })
					.to(0.3, { scaleY: 1.0 }, { easing: "sineInOut" })
			)
			.start();
	},
	stopWalkAnimation() {
		if (this.walkTween) {
			this.walkTween.stop();
			this.walkTween = null;
		}
	},
	moveLeft() {
		this.moveByDirection(cc.v2(-1, 0));
	},
	handleOutOfBounds() {
		this.stopWalkAnimation();
		this.node.destroy();
	},
	handleHitObstacle() {

	},
	emitHitEvent(other, self) {
		const collision = EntityCollision.createFromCollision(other, self);
		Emitter.instance.emit(EnemyEventKeys.ENEMY_HIT_ENTITY, collision);
	},
	onCollisionEnter(other, self) {
		switch (other.node.group) {
			case EntityGroup.Boundary:
			case EntityGroup.Obstacle:
				this.emitHitEvent(other, self);
				break;
			default:

		}
	}
});