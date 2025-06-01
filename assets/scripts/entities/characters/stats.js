export class Stats {
	constructor({ health = 100, attack = 10, defense = 5, speed = 100 }) {
		this.health = health;
		this.attack = attack;
		this.defense = defense;
		this.speed = speed;
	}

	applyLevelScaling(scale, level = 1) {
		this.health += scale.health * (level - 1);
		this.attack += scale.attack * (level - 1);
		this.defense += scale.defense * (level - 1);
		this.speed += scale.speed * (level - 1);
	}
}
