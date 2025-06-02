import { EntityGroup } from "./entityType";

function getIdByNode(node) {
    const script = getScript(node);
    if (!script) {
        return null;
    }
    return script.getId();
}

function getScript(other) {
    const group = other.node.group;
    switch (group) {
        case EntityGroup.Enemy:
            const Enemy = require("./characters/enemies/enemy");
            return other.node.getComponent(Enemy);
        case EntityGroup.Bullet:
            const Bullet = require("./bullet/bulletBase");
            return other.node.getComponent(Bullet);
    }
    return null;
}

export class EntityCollision {
    constructor({ otherType = null, position = null, targetId = null, currentId = null }) {
        this.otherType = otherType;
        this.position = position;
        this.targetId = targetId;
        this.currentId = currentId;
    }
    static createFromCollision(other, self) {
        if (!other || !other.node || !self || !self.node) {
            throw new Error("Invalid collision data provided.");
        }
        const targetId = getIdByNode(other);
        const currentId = getIdByNode(self);
        return new EntityCollision({
            otherType: other.node.group,
            position: self.node.position,
            targetId,
            currentId,
        });
    }
}

