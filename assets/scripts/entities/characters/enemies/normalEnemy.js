const { EnemyType } = require('./enemyType');


cc.Class({
    extends: require('enemy'),
    properties: {
        enemyType: {
            type: cc.Enum(EnemyType),
            override: true,
            default: EnemyType.Normal,
            tooltip: "Type of the enemy (Normal, Boss, MiniBoss)",
        },
    },
    onLoad() {
        this._super();
        this.startWalkAnimation();
    },
    startWalkAnimation() {
        this.background = this.node.getChildByName("background");
        cc.tween(this.background)
            .repeatForever(
                cc.tween()
                    .to(0.3, { scaleY: 1.1 }, { easing: "sineInOut" })
                    .to(0.3, { scaleY: 0.9 }, { easing: "sineInOut" })
                    .to(0.3, { scaleY: 1.0 }, { easing: "sineInOut" })
            )
            .start();
    }

});
