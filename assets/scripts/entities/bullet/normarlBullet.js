const { BulletType } = require("./bulletType");
const BulletBase = require("./bulletBase");
cc.Class({
    extends: BulletBase,

    properties: {

        BulletType: {
            type: cc.Enum(BulletType),
            override: true,
            default: BulletType.Normal,
            tooltip: "Type of the bullet (Normal, Explosive, etc.)",
        },
        speed: {
            default: 500,
            override: true,
            tooltip: "Speed of the bullet in pixels per second",
        },
        damage: {
            default: 10,
            override: true,
            tooltip: "Damage dealt by the bullet",
        },
    },

});
