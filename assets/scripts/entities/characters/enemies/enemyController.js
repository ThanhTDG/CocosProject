const { EnemyType } = require("./enemyType");
const { randomId } = require("../../../utils/randomUtils");
const {
	validateVector,
	getPositionNodeSpace,
	getPositionWorldSpace,
} = require("../../../utils/vectorUtils");
const { EnemySpawnManager } = require("./enemySpawnManager");

const EnemySprite = cc.Class({
	name: "EnemySprite",
	properties: {
		spriteFrame: {
			default: null,
			type: cc.SpriteFrame,
			tooltip: "Sprite of enemy",
		},
		enemyType: {
			default: EnemyType.Normal,
			type: cc.Enum(EnemyType),
			tooltip: "Enemy type",
		},
	},
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
	},
	onLoad() {
		this._super();
		this.initialize();
	},

	initialize() {
		this.setUpSpawnManager();
		this.registerEvents();
		this.start();
	},
	setUpSpawnManager() {
		this.listSpawned = [];
		this.spawnManager = new EnemySpawnManager({
			controller: this,
			prefab: this.prefab,
			listSprite: this.enemySprites,
			listSpawned: this.listSpawned,
		});
	},

	start(scenario) {
		let scenarioTest = require("../../../dataTest/sernario").scenarioTest;
		this.spawnManager.spawnByScenario(scenarioTest);
		// this.spawnManager(scenario);
	},
	registerEvents() {
		this.registerSpawnEvents();
	},
	registerSpawnEvents() {
		this.registerEvent("spawnEnemy", (scenario) => {
			this.start(scenario);
		});
	},
});
