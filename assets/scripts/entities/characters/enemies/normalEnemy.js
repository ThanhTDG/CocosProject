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
    },


});
