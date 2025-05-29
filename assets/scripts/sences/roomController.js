const { CharacterType } = require("../characters/characterType");
const CharacterBase = require("../characters/characterBase");


cc.Class({
    extends: cc.Component,

    properties: {
        spawnPoints: {
            default: [],
            type: [cc.Node],
            tooltip: "Array of spawn points for characters in the room",
        },

        normalCount: {
            default: 5,
            type: cc.Integer,
        },
        normalEnemyPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "Prefab for normal enemies that can spawn in the room",
        }
    },

    onLoad() {
        this.initRoom();
    },

    initRoom() {
        this.initCanvasSize();
        this.spawnedEnemies = [];
        this.spawnInterval = 5;
        this.spawnTimer = 0;
        this.randomSpawnEnemies()
    },

    initCanvasSize() {
        const canvasNode = cc.find("canvas");
        if (!canvasNode) {
            cc.error("Canvas node not found!");
            return;
        }
        const canvasComponent = canvasNode.getComponent(cc.Canvas);
        this.maxWidth = canvasComponent.designResolution.width;
        this.maxHeight = canvasComponent.designResolution.height;
    },

    randomSpawnEnemies() {
        const spawnTime = this.randomSpawnTime();
        this.scheduleOnce(() => {
            this.spawnEnemy(this.normalEnemyPrefab);
            this.randomSpawnEnemies();
        }, spawnTime / 1000);
    },

    spawnEnemy(prefab) {
        if (!this.spawnPoints.length) {
            cc.error("No spawn points available to create enemies.");
            return;
        }
        const position = this.getRandomSpawnPoint();
        const enemy = this.createEnemyFromPrefab(position, prefab);
        if (enemy) {
            this.moveEnemyToLeft(enemy);
        }
    },

    randomSpawnTime() {
        const minTime = 500;
        const maxTime = 5000;
        return Math.random() * (maxTime - minTime) + minTime;
    },

    getRandomSpawnPoint() {
        const index = Math.floor(Math.random() * this.spawnPoints.length);
        return this.spawnPoints[index].position;
    },

    moveEnemyToLeft(enemyNode) {
        const targetPosition = this.getTargetPositionLeft(enemyNode.position.x, enemyNode.position.y);
        const characterScript = enemyNode.getComponent(CharacterBase);
        if (!characterScript) {
            throw new Error("Character script not found on enemy node.");
            return;
        }
        characterScript.moveTo(targetPosition, (node) => {

            node.destroy();
        });
    },

    getTargetPositionLeft(x, y = 0) {
        return cc.v2(x - this.maxWidth - 200, y);
    },

    createEnemyFromPrefab(position, prefab) {
        if (!prefab) {
            throw new Error("Character script not found on enemy node.");
        }
        const enemy = cc.instantiate(prefab);
        enemy.setPosition(position);
        enemy.parent = this.node;
        this.spawnedEnemies.push(enemy);
        return enemy;
    }

});
