import { Stats } from "../stats";
import { EnemyType } from "./enemyType";

export const enemyStatsConfig = {
	base: {
		[EnemyType.Normal]: { health: 100, attack: 10, defense: 5, speed: 100 },
		[EnemyType.MiniBoss]: { health: 200, attack: 15, defense: 20, speed: 50 },
		[EnemyType.Boss]: { health: 80, attack: 8, defense: 3, speed: 150 },
	},
	scale: { health: 20, attack: 5, defense: 2, speed: 5 },
};

export class EnemyStats extends Stats {
	constructor(enemyType, level = 1) {
		const baseStats = enemyStatsConfig.base[enemyType];
		const scale = enemyStatsConfig.scale;
		super(baseStats);
		this.applyLevelScaling(scale, level);
	}
}
