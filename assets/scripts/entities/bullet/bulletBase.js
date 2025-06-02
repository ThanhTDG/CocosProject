const { validateVector } = require("../../utils/vectorUtils");
const { BulletType } = require("./bulletType");
const { EntityType, EntityGroup } = require("../entityType");
const Emitter = require("../../events/mEmitter");
const { BULLET_HIT_ENTITY } = require("../../events/keys/bulletEventKeys");
const { EntityCollision } = require("../entityCollision");
const { BulletStats } = require("./bulletStats");

cc.Class({
	extends: cc.Component,

	properties: {
		entityType: {
			type: cc.Enum(EntityType),
			default: EntityType.Bullet,
			tooltip: "Type of the entity (Bullet, Enemy, etc.)",
		},
		bulletType: {
			type: cc.Enum(BulletType),
			default: BulletType.Normal,
			tooltip: "Type of the bullet (Normal, Explosive, etc.)",
		},
		speed: {
			default: 500,
			tooltip: "Speed of the bullet in pixels per second",
		},
		damage: {
			default: 10,
			tooltip: "Damage dealt by the bullet",
		},
	},

	update(dt) {
		this.move(dt);
	},
	move(dt) {
		const direction = this.node.direction;
		if (direction) {
			this.node.position = this.node.position.add(
				direction.mul(this.speed * dt)
			);
		} else {
			cc.error("Direction is not defined for bullet movement.");
		}
	},
	setId(id) {
		this.id = id;
	},
	getId() {
		return this.id;
	},
	handleHitEnemy() {
		this.node.destroy();
	},
	shoot(direction) {
		this.node.direction = validateVector(direction);
	},
	emitHitEvent(other, self) {
		const collision = EntityCollision.createFromCollision(other, self);
		Emitter.instance.emit(BULLET_HIT_ENTITY, collision);
	},
	getStats() {
		return BulletStats.formComponent(this);
	},

	handleHitEntity() {
		this.node.destroy();
	},
	onCollisionEnter(other, self) {
		const group = other.node.group;
		switch (group) {
			case EntityGroup.Boundary:
			case EntityGroup.Enemy:
				this.emitHitEvent(other, self);
				break;
			default:

		}


	},
});
