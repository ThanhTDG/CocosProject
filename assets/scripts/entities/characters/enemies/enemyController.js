const { EnemyType } = require("./enemyType");
const { randomId } = require("../../../utils/randomUtils");
const NormalEnemy = require("./normalEnemy");

const EnemySprite = cc.Class({
    name: "EnemySprite",
    properties: {
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "Sprite of enemy"
        },
        enemyType: {
            default: EnemyType.Normal,
            type: cc.Enum(EnemyType),
            tooltip: "Enemy type"
        },
    }
});

cc.Class({
    extends: require("events/eventController"),
    properties: {
        prefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "Prefab for the enemy character",
        },
        enemySprites: {
            default: [],
            type: [EnemySprite],
            tooltip: "Array of enemy sprites with their types",
        },
        spawnPoints: {
            default: [],
            type: [cc.Node],
            tooltip: "Array of spawn points for enemies",
        },
        minTimeSpawn: {
            default: 1000,
            type: cc.Integer,
        },
        maxTimeSpawn: {
            default: 5000,
            type: cc.Integer,
        },
        layerNode: {
            default: null,
            type: cc.Node,
            tooltip: "Layout spawn points",
        }
    },
    onLoad() {
        this.initialize();
    },
    initialize() {
        this.listSpawnEnemy = [];
        this.assignListEnemyType()
        this.randomSpawnEnemies();

    },
    assignListEnemyType() {
        this.listEnemyType = [];
        this.enemySprites.forEach(sprite => {
            this.listEnemyType.push(sprite.enemyType);
        })
    },
    randomSpawnEnemy(enemyType = EnemyType.Normal) {
        const enemy = this.createEnemy(enemyType);
        this.setupEnemy(enemy);
        this.startSpawnEnemies(enemy);
        cc.log(`Spawned enemy of type: ${enemy}, ID: ${enemy.getId()}`);
    },
    setupEnemy(enemy) {
        enemy.initialize();
        const id = randomId();
        enemy.setId(id);
        this.listSpawnEnemy.push(enemy);
        this.layerNode.addChild(enemy.node);

    },
    startSpawnEnemies(enemy) {
        enemy.startMove();
        const spawnPoint = this.getRandomSpawnPoint();
        enemy.setPosition(spawnPoint.position);
    },
    randomSpawnEnemies() {
        const spawnTime = this.randomSpawnTime();
        const randomEnemyType = this.randomEnemyType();
        this.scheduleOnce(() => {
            this.randomSpawnEnemy(randomEnemyType);
            this.randomSpawnEnemies();
        }, spawnTime / 1000);
    },

    randomEnemyType() {
        const randomIndex = Math.floor(Math.random() * this.listEnemyType.length);
        return this.listEnemyType[randomIndex];
    },

    randomSpawnTime() {
        const minTime = this.minTimeSpawn;
        const maxTime = this.maxTimeSpawn;
        if (minTime >= maxTime) {
            cc.error("Minimum spawn time must be less than maximum spawn time.");
            return 0;
        }
        return Math.random() * (maxTime - minTime) + minTime;
    },
    getRandomSpawnPoint() {
        if (this.spawnPoints.length === 0) {
            cc.error("No spawn points available.");
            return null;
        }
        if (!this._spawnPointHistory) this._spawnPointHistory = [];
        let randomIndex;
        let tryCount = 0;
        do {
            randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
            tryCount++;
            if (tryCount > 10) break;
        } while (
            this._spawnPointHistory.length >= 2 &&
            this._spawnPointHistory[this._spawnPointHistory.length - 1] === randomIndex &&
            this._spawnPointHistory[this._spawnPointHistory.length - 2] === randomIndex
        );
        this._spawnPointHistory.push(randomIndex);
        if (this._spawnPointHistory.length > 3) {
            this._spawnPointHistory.shift();
        }
        console.log(`Selected spawn point index: ${randomIndex}`);
        return this.spawnPoints[randomIndex];
    },
    createEnemy(enemyType = EnemyType.Normal) {
        const enemyPrefab = this.prefab;
        const enemyNode = cc.instantiate(enemyPrefab);
        const component = this.assignEnemy(enemyNode, enemyType);
        return component;
    },

    assignEnemy(enemyNode, enemyType = EnemyType.Normal) {
        const enemyScript = this.getScriptByType(enemyType);
        let enemyComponent = enemyNode.getComponent(enemyScript);
        if (!enemyComponent) {
            enemyComponent = enemyNode.addComponent(enemyScript);
        }
        const sprite = this.getSpriteFrameByType(enemyType);
        enemyComponent.setSprite(sprite);
        return enemyComponent;
    },

    getScriptByType(enemyType = EnemyType.Normal) {
        switch (enemyType) {
            case EnemyType.Normal:
                return NormalEnemy;
            default:
                throw new Error(`Enemy type ${enemyType} is not supported.`);
        }
    },
    getSpriteFrameByType(enemyType) {
        const enemySprite = this.enemySprites.find(sprite => sprite.enemyType === enemyType);
        if (enemySprite) {
            return enemySprite.spriteFrame;
        }
        cc.error(`No sprite found for enemy type: ${enemyType}`);
        return null;
    },

});
