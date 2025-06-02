const { EnemyType } = require("./enemyType");
const { EnemySpawnManager } = require("./enemySpawnManager");
const EnemyEventKeys = require("../../../events/keys/enemyEventKeys");
const GameEventKeys = require("../../../events/keys/gameEventKeys");
const EffectEventKeys = require("../../../events/keys/effectEventKeys");
const Emitter = require("../../../events/mEmitter");
const { EffectType } = require("../../../components/effect/effectType");
const { EffectItem } = require("../../../components/effect/effectItem");
const { EntityCollision } = require("../../entityCollision");
const { EntityGroup } = require("../../entityType");
const BulletEventKeys = require("../../../events/keys/bulletEventKeys");
const { BulletStats } = require("../../bullet/bulletStats");
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
		this.registerEnemyHitEvents();
		this.registerGetBulletHit();
	},

	registerEnemyHitEvents() {
		this.registerEvent(
			EnemyEventKeys.ENEMY_HIT_ENTITY,
			this.handleHitEntity.bind(this)
		);
	},
	registerGetBulletHit() {
		this.registerEvent(
			BulletEventKeys.BULLET_HIT_ENEMY,
			this.handleEnemyTakeDame.bind(this)
		);
	},

	registerSpawnEvents() {
		this.registerEvent(
			GameEventKeys.START_ENEMY_SPAWN,
			this.startSpawn.bind(this)
		);
	},
	handleHitEntity(entityCollision) {
		const isExited = entityCollision instanceof EntityCollision;
		if (!isExited) {
			cc.error("Invalid entity collision data provided.");
			return;
		}
		const { otherType, currentId } = entityCollision;
		switch (otherType) {
			case EntityGroup.Obstacle:
				this.handleHitObstacle(currentId);
				break;
			case EntityGroup.Boundary:
				this.handleHitBoundary(currentId);
				break;
			default:
				cc.warn(`why type is here ${otherType}`);
				break;
		}
	},
	handleEnemyTakeDame(bulletStats) {
		const isValid = bulletStats instanceof BulletStats;
		if (!isValid) {
			cc.error("Invalid bullet stats provided.");
			return;
		}
		const { targetId } = bulletStats;
		const { enemy } = this.getEnemyById(targetId);
		enemy.takeDamage(bulletStats.damage);
	},

	handleHitBoundary(id) {
		const { enemy, index } = this.getEnemyById(id);
		enemy.moveOutOfBounds();
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
		enemy.takeDamage(50);
		const worldPosition = this.node.convertToWorldSpaceAR(enemy.node.position);
		this.emitEffectExplosion(worldPosition);
	},
	emitEffectExplosion(worldPosition) {
		const effectItem = new EffectItem({
			effectType: EffectType.EXPLOSION,
			worldPosition,
		});
		Emitter.instance.emit(EffectEventKeys.SPAWN_EFFECT, effectItem);
	},
});
