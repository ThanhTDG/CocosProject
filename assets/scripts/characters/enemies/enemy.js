const { randomId } = require("../../utils/randomUtils");
const { CharacterType } = require("../characterType");
const { EnemyType } = require("./enemyType");

cc.Class({
    extends: require("characterBase"),
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
    onLoad() {
        this.id = randomId();
    },

});
