import { EnemyType } from "../entities/characters/enemies/enemyType";

export const scenarioTest = (() => {
	const totalDuration = 90 * 1000;
	const totalEnemies = 30;
	const delayBetweenSpawns = totalDuration / totalEnemies;

	const scenario = [];
	const xPosition = 1400;
	let yPosition = 600;

	for (let i = 0; i < totalEnemies; i++) {
		scenario.push({
			type: EnemyType.Normal,
			level: 1,
			position: new cc.Vec2(xPosition, yPosition),
			delay: i * delayBetweenSpawns,
		});

		yPosition -= 30;
	}
	return scenario;
})();
