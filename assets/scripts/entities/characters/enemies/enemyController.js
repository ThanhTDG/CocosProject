const { EnemyType } = require("./enemyType");
const { EnemySpawnManager } = require("./enemySpawnManager");
const EnemyEventKeys = require("../../../events/keys/enemyEventKeys");
const GameEventKeys = require("../../../events/keys/gameEventKeys");
const EffectEventKeys = require("../../../events/keys/effectEventKeys");
const Emitter = require("../../../events/mEmitter");
const { EffectType } = require("../../../components/effect/effectType");
const { EffectItem } = require("../../../components/effect/effectItem");

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

	startSpawn(scenario) {
		this.spawnManager.spawnByScenario(scenario);
	},
	registerEvents() {
		this.registerSpawnEvents();
		this.registerEnemyOutScreen();
		this.registerHitObstacleEvents();
	},
	registerHitObstacleEvents() {
		this.registerEvent(
			EnemyEventKeys.ENEMY_HIT_OBSTACLE,
			this.handleHitObstacle.bind(this)
		);
	},

	registerSpawnEvents() {
		this.registerEvent(
			GameEventKeys.START_ENEMY_SPAWN,
			this.startSpawn.bind(this)
		);
	},
	handleStartEnemySpawn(scenario) {
		this.startSpawn(scenario);
	},
	registerEnemyOutScreen() {
		this.registerEvent(
			EnemyEventKeys.ENEMY_OUTSIDE,
			this.handleOutOfBounds.bind(this)
		);
	},
	handleOutOfBounds(id) {
		const { enemy, index } = this.getEnemyById(id);
		enemy.handleOutOfBounds();
		this.listSpawned.splice(index, 1);
	},
	findIndexById(id) {
		return this.listSpawned.findIndex((e) => e.id === id);
	},
	getEnemyById(id, mustExist = true) {
		const index = this.findIndexById(id);
		const isFound = index !== -1;
		if (isFound) {
			return { enemy: this.listSpawned[index], index: index };
		}
		if (mustExist) {
			cc.error(`Enemy with id ${id} not found.`);
		}
		return { enemy: null, index: -1 };
	},
	handleHitObstacle(id) {
		const { enemy } = this.getEnemyById(id);
		enemy.handleHitObstacle();
		const worldPosition = this.node.convertToWorldSpaceAR(enemy.node.position);
		this.emitEnemyHitObstacle(worldPosition);
	},
	emitEnemyHitObstacle(worldPosition) {
		const effectItem = new EffectItem({
			effectType: EffectType.EXPLOSION,
			worldPosition,
		});
		Emitter.instance.emit(EffectEventKeys.SPAWN_EFFECT, effectItem);
	},
});
