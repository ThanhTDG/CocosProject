// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 100,
            type: cc.Float
        },
        colorChangeSpeed: {
            default: 1,
            type: cc.Float
        },
        scaleSpeed: {
            default: 0.5,
            type: cc.Float
        },
        maxScale: {
            default: 2,
            type: cc.Float
        },
        minScale: {
            default: 0.5,
            type: cc.Float
        }
    },

    onLoad() {
        this.angle = 0;
        this.scaleDirection = 1;
    },

    start() {
        this.originalPosition = this.node.position;
    },

    update(dt) {
        this._moveInCircle(dt);
        this._changeColor(dt);
        this._scaleNode(dt);
    },

    _moveInCircle(dt) {
        this.angle += this.speed * dt;
        let radius = 100;
        let x = this.originalPosition.x + radius * Math.cos(this.angle * Math.PI / 180);
        let y = this.originalPosition.y + radius * Math.sin(this.angle * Math.PI / 180);
        this.node.setPosition(x, y);
    },

    _changeColor(dt) {
        let color = this.node.color;
        color.r = (color.r + this.colorChangeSpeed * dt * 255) % 255;
        color.g = (color.g + this.colorChangeSpeed * dt * 255) % 255;
        color.b = (color.b + this.colorChangeSpeed * dt * 255) % 255;
        this.node.color = color;
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
    }
});
