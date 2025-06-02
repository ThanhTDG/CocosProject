export class BulletStats {
	constructor({
		damage = 10,
		speed = 500,
		targetId = null,
		targetType = null,
		position = null,
	} = {}) {
		this.damage = damage;
		this.speed = speed;
		this.targetId = targetId;
		this.targetType = targetType;
		this.position = position;
	}
}
