const { validateVector } = require("../../utils/vectorUtils");
const { BulletType } = require("./bulletType");
const { EntityType, EntityGroup } = require("../entityType");
const mEmitter = require("../../events/mEmitter");
const { BulletStats } = require("./bulletStats");
const { BULLET_HIT } = require("../../events/keys/bulletEventKeys");

cc.Class({
	extends: cc.Component,

	properties: {
		entityType: {
			type: cc.Enum(EntityType),
			default: EntityType.Bullet,
			tooltip: "Type of the entity (Bullet, Enemy, etc.)",
		},
		BulletType: {
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
	shoot(direction) {
		this.node.direction = validateVector(direction);
	},
	emitHitEvent(group, id) {
		const bulletStats = new BulletStats({
			damage: this.damage,
			speed: this.speed,
			targetId: id,
			targetType: group,
			position: this.node.position,
		});
		mEmitter.instance.emit(BULLET_HIT, bulletStats);
	},
	onCollisionEnter(other, self) {
		const group = other.node.group;
		let id = other.node.id;
		this.emitHitEvent(group, id);
	},
});
