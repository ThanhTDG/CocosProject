const { CharacterType } = require("../characterType");
const { EnemyType } = require("./enemyType");
const { EntityGroup } = require("../../entityType");
const EnemyEventKeys = require("../../../events/keys/enemyEventKeys");
const CharacterBase = require("../characterBase");
const Emitter = require("../../../events/mEmitter");
const { EntityCollision } = require("../../entityCollision");
const StateMachine = require('javascript-state-machine');
const EnemyState = cc.Enum({
	Idle: "Idle",
	Moving: "Moving",
	Hit: "Hit",
	Dead: "Dead",
	Outside: "Outside"
})

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


	initStateMachine() {
		this.stateMachine = new StateMachine({
			init: EnemyState.Idle,
			transitions: [
				{ name: 'move', from: EnemyState.Idle, to: EnemyState.Moving },
				{ name: 'hit', from: [EnemyState.Moving, EnemyState.Hit], to: EnemyState.Hit },
				{ name: 'recover', from: EnemyState.Hit, to: EnemyState.Moving },
				{ name: 'die', from: EnemyState.Hit, to: EnemyState.Dead },
				{ name: 'moveOutOfBounds', from: [EnemyState.Moving, EnemyState.Hit], to: EnemyState.Outside }
			],
			methods: {
				onMove: () => { this.handleOnMove(); },
				onHit: () => { this.handleOnHit(); },
				onRecover: () => { this.handleOnRecover(); },
				onDead: () => { this.handleOnDie() },
				onMoveOutOfBounds: () => { this.handleOutside() },
			}
		});
	},
	handleOnRecover() {
		this.startWalkAnimation();
		this.moveLeft();
	},
	handleOutside() {
		this.stopWalkAnimation();
		this.node.destroy();
	},
	handleOnHit() {
		this.isMoving = false;
		this.stopWalkAnimation();
		this.knockbackAnimation(() => {
			if (this.stateMachine.is(EnemyState.Hit) && this.stats.getHealth() <= 0) {
				this.stateMachine.die();
			} else if (this.stateMachine.is(EnemyState.Hit)) {
				this.stateMachine.recover();
			}
		})
	},
	knockbackAnimation(callback) {
		const knockbackDistance = 50;
		const knockbackTime = 0.15;
		const currentPos = this.node.getPosition();
		const newPos = cc.v2(currentPos.x + knockbackDistance, currentPos.y);
		cc.tween(this.node)
			.to(knockbackTime, { position: newPos }, { easing: "sineOut" })
			.call(callback)
			.start();
	},
	handleOnDie() {
		this.isMoving = false;
		this.stopWalkAnimation();
		this.disableCollider();
		this.dieAnimation(() => {
			this.node.destroy();
		});
	},
	dieAnimation(callback) {
		const dieTime = 1;
		cc.tween(this.node)
			.to(dieTime, { opacity: 0 }, { easing: "sineIn" })
			.call(callback)
			.start();
	},
	disableCollider() {
		const collider = this.getComponent(cc.Collider);
		if (collider) {
			collider.enabled = false;
		}
	},


	handleOnMove() {
		this.moveLeft();
		this.startWalkAnimation();
	},
	startMove() {
		this.stateMachine.move();
	},
	takeDamage(damage = 0) {
		if (this.stateMachine.is(EnemyState.Dead)) {
			return;
		}
		const hp = this.stats.getHealth() - damage;
		this.stats.setHealth(hp);
		this.stateMachine.hit();
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
		this.stateMachine.moveOutOfBounds();
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
	},
	onDestroy() {
		cc.log("Enemy destroyed: ", this.node.name);
	}
});