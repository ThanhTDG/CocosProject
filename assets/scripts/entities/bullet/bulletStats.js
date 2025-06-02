const { BulletType } = require("./bulletType");

export class BulletStats {
    constructor({ damage = 10, speed = 500, bulletType = null, targetId = null }) {
        this.damage = damage;
        this.speed = speed;
        this.bulletType = bulletType
        this.targetId = this.targetId
    }
    setTargetId(targetId) {
        this.targetId = targetId;
    }
    static formComponent(component) {
        return new BulletStats({
            damage: component.damage,
            speed: component.speed,
            bulletType: component.bulletType,
        });
    }

}