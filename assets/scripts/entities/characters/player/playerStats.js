import { Stats } from "../stats";

export const playerStatsConfig = {
	base: { health: 150, attack: 20, defense: 10, speed: 120 },
	scale: { health: 30, attack: 10, defense: 5, speed: 10 },
};

export class PlayerStats extends Stats {
	constructor(level = 1) {
		const baseStats = playerStatsConfig.base;
		const scale = playerStatsConfig.scale;
		super(baseStats);
		this.applyLevelScaling(scale, level);
	}
}
