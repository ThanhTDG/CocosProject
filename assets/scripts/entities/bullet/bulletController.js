const EventController = require("events/eventController");
const BulletEventKeys = require("../../events/keys/bulletEventKeys");
const EffectEventKeys = require("../../events/keys/effectEventKeys");
const Emitter = require("../../events/mEmitter");
const { EntityCollision } = require("../entityCollision");
const { EntityGroup } = require("../entityType");
const BulletBase = require("./bulletBase");
const { validateVector } = require("../../utils/vectorUtils");
const { InitBullet } = require("./initBullet");
const { randomId } = require("../../utils/randomUtils");
const { EffectItem } = require("../../components/effect/effectItem");
const { EffectType } = require("../../components/effect/effectType");
cc.Class({
	extends: EventController,

	properties: {
		bulletPrefabs: {
			default: [],
			type: [cc.Prefab],
			tooltip: "Prefabs for different bullet types",
		},
	},
	onLoad() {
		this._super();
		this.initialize();
	},

	initialize() {
		this.listSpawned = [];
		this.prefabMap = new Map();
		this.initializePrefabMap();
	},
	initializePrefabMap() {
		for (let i = 0; i < this.bulletPrefabs.length; i++) {
			const prefab = this.bulletPrefabs[i];
			const bulletBase = prefab.data.getComponent(BulletBase);
			if (bulletBase && bulletBase.bulletType !== undefined) {
				this.prefabMap.set(bulletBase.bulletType, prefab);
			}
			else {
				cc.error(
					`Prefab at index ${i} does not have a valid BulletBase component.`
				);
			}
		}
	},


	registerEvents() {
		this.registerSpawnEvents();
		this.registerBulletHitEvents();
	},

	registerSpawnEvents() {
		this.registerEvent(
			BulletEventKeys.SPAWN_BULLET,
			this.handleSpawnBullet.bind(this)
		);
		this.registerEvent(
			BulletEventKeys.SPAWN_LIST_BULLET,
			this.handleSpawnBullet.bind(this)
		);
	},

	registerBulletHitEvents() {
		this.registerEvent(
			BulletEventKeys.BULLET_HIT_ENTITY,
			this.handleBulletHit.bind(this)
		);
	},
	handleSpawnListBullet(listSpawned) {
		if (!Array.isArray(listSpawned)) {
			cc.error("Invalid list of spawned bullets provided.");
			return;
		}
		listSpawned.forEach((initBullet) => {
			this.handleSpawnBullet(initBullet);
		})
	},

	handleSpawnBullet(initBullet) {
		const isValid = initBullet instanceof InitBullet;
		if (!isValid) {
			cc.error("Invalid bullet data provided.");
		}
		const { direction, worldPosition, bulletType } = initBullet;
		let localPosition = this.node.convertToNodeSpaceAR(worldPosition);
		this.spawnBullet(direction, localPosition, bulletType);
	},

	spawnBullet(direction, position, bulletType = 0) {
		const prefab = this.getPrefab(bulletType);
		const bulletNode = this.createNode(prefab, position);
		const bulletBase = bulletNode.getComponent(BulletBase);
		this.initializeId(bulletBase);
		this.listSpawned.push(bulletBase);
		bulletBase.shoot(direction);
		return bulletNode;
	},
	initializeId(bulletBase) {
		const id = randomId();
		bulletBase.setId(id);
	},

	getPrefab(bulletType) {
		const prefab = this.prefabMap.get(bulletType);
		return prefab;
	},

	createNode(prefab, position) {
		const node = cc.instantiate(prefab);
		node.setPosition(position);
		this.node.addChild(node);
		return node;
	},

	handleBulletHit(entityCollision) {
		const isExited = entityCollision instanceof EntityCollision;
		if (!isExited) {
			cc.error("Invalid entity collision data provided.");
			return;
		}
		const { otherType, targetId, currentId } = entityCollision;
		switch (otherType) {
			case EntityGroup.Boundary:
				this.handleHitBoundary(currentId);
				break;
			case EntityGroup.Enemy:
				this.handleHitEnemy(targetId, currentId);
				break;
		}
	},
	handleHitEnemy(targetId, currentId) {
		const { bullet, index } = this.getById(currentId)
		const stats = bullet.getStats();
		stats.setTargetId = targetId;
		this.emitHitEnemy(stats);
		const worldPosition = this.node.convertToWorldSpaceAR(bullet.node.position);
		this.emitEffectExplosion(worldPosition)
		bullet.handleHitEnemy();
		this.removeByIndex(index);
	},
	removeByIndex(index) {
		const bullet = this.listSpawned[index];
		bullet.destroy();
		this.listSpawned.splice(index, 1);
	},
	getById(id, mustExist = true) {
		const index = this.findIndexById(id);
		const isFound = index !== -1;
		if (isFound) {
			return { bullet: this.listSpawned[index], index: index };
		}
		if (mustExist) {
			cc.error(`bullet with id ${id} not found.`);
		}
		return { bullet: null, index: -1 };
	},
	findIndexById(id) {
		return this.listSpawned.findIndex((e) => e.id === id);
	},

	handleHitBoundary(id) {
		const { bullet, index } = this.getById(id);
		bullet.handleHitEntity();
		this.removeByIndex(index);
	},

	removeBulletById(bulletId) {
		const index = this.listSpawned.findIndex(bullet => bullet.id === bulletId);
		if (index !== -1) {
			const bullet = this.listSpawned[index];
			bullet.destroy();
			this.listSpawned.splice(index, 1);
		}
	},
	emitHitEnemy(bulletStats) {
		Emitter.instance.emit(BulletEventKeys.BULLET_HIT_ENEMY, bulletStats);
	},

	emitEffectExplosion(worldPosition) {
		const effectItem = new EffectItem({
			effectType: EffectType.EXPLOSION,
			worldPosition,
		});
		Emitter.instance.emit(EffectEventKeys.SPAWN_EFFECT, effectItem);
	},
});
