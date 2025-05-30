const { CharacterType } = require("characterType");
const { randomId } = require("../utils/randomUtils");
cc.Class({
    extends: cc.Component,

    properties: {
        characterType: {
            type: cc.Enum(CharacterType),
            default: CharacterType.Player,
            tooltip: "Type of the character (Player, Enemy, etc.)",
        },
        speed: {
            default: 100,
            type: cc.Integer,
            tooltip: "Movement speed of the character",
        },
    },

    moveTo(targetPosition, onArrived) {
        this.moveTarget = targetPosition;
        this.onArrived = onArrived;
        this.isMoving = true;
    },

    update(dt) {
        this.updateMovement(dt);
    },

    updateMovement(dt) {
        if (this.isMoving && this.moveTarget) {
            const currentPos = this.node.position;
            const targetPos = this.moveTarget;
            const speed = this.speed;

            const direction = targetPos.sub(currentPos);
            const distance = direction.mag();

            if (distance < speed * dt) {
                this.node.setPosition(targetPos);
                this.isMoving = false;
                if (typeof this.onArrived === "function") {
                    this.onArrived(this.node);
                }
            } else {
                const moveStep = direction.normalize().mul(speed * dt);
                this.node.setPosition(currentPos.add(moveStep));
            }
        }
    },

    getControlScript() {
        return this.name;
    },
    onMove() { },
    onAttack() { },
    onDie() { },
    onHit() { },

});
