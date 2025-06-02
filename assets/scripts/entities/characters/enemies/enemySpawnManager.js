import { getPositionNodeSpace } from "../../../utils/vectorUtils";
import { EnemyStats } from "./enemyStats";

const { EnemyType } = require("./enemyType");
const { randomId } = require("../../../utils/randomUtils");
const NormalEnemy = require("./normalEnemy");

export class EnemySpawnManager {
	constructor({ controller, prefab, listSprite, listSpawned }) {
		this.controller = controller;
		this.prefab = prefab;
		this.listSprite = listSprite;
		this.listSpawned = listSpawned;
		this.spriteMap = this.createSpriteMapping(listSprite);
		this.scheduledTasks = [];
	}

	createSpriteMapping(listSprite) {
		return listSprite.reduce((map, sprite) => {
			map.set(sprite.enemyType, sprite.spriteFrame);
			return map;
		}, new Map());
	}

	createEnemy(type = EnemyType.Normal, level = 1) {
		const node = this.createNode();
		const script = this.setup(node, type, level);
		return script;
	}

	createNode() {
		return cc.instantiate(this.prefab);
	}

	setup(node, type, level = 1) {
		const script = this.setupScript(node, type);
		this.setupSprite(script, type);
		this.setupStats(script, level);
		this.setupId(script);
		return script;
	}

	setupSprite(script, type) {
		const spriteFrame = this.spriteMap.get(type);
		script.setSprite(spriteFrame);
	}

	setupScript(node, type) {
		const script = this.getScriptByType(type);
		return node.addComponent(script);
	}

	setupStats(script, level = 1) {
		const stats = new EnemyStats(script.enemyType, level);
		script.setStats(stats);
	}

	setupId(script) {
		const id = randomId();
		script.setId(id);
		this.listSpawned.push(script);
	}

	getScriptByType(type) {
		switch (type) {
			case EnemyType.Normal:
				return NormalEnemy;
			default:
				throw new Error(`Type ${type} is not supported.`);
		}
	}

	spawnEnemy(type = EnemyType.Normal, level = 1, worldPosition = null) {
		const enemy = this.createEnemy(type, level);
		this.controller.node.addChild(enemy.node);
		const localPosition = getPositionNodeSpace(
			this.controller.node,
			worldPosition
		);
		enemy.setPosition(localPosition);
		enemy.startMove();
	}

	spawnByScenario(scenario) {
		scenario.forEach((step) => {
			const task = () => {
				this.spawnEnemy(step.type, step.level, step.position);
			};
			this.controller.scheduleOnce(task, step.delay / 1000);
			this.scheduledTasks.push(task);
		});
	}
}
