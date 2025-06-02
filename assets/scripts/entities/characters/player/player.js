const { CharacterType } = require("../characterType");
const { PlayerState } = require("./playerState");

cc.Class({
	extends: require("../characterBase"),

	properties: {
		characterType: {
			type: cc.Enum(CharacterType),
			override: true,
			default: CharacterType.Player,
			tooltip: "Type of the character (Player, Enemy, etc.)",
		},
		state: {
			default: PlayerState.Idle,
			type: PlayerState,
			tooltip:
				"Current state of the player character (idle, running, jumping, etc.)",
		},
	},
	changeState(newState) {
		this.state = newState;
		switch (this.state) {
			case PlayerState.Idle:
				this.onEnterIdle();
				break;
			case PlayerState.Attack:
				this.onEnterAttack();
				break;
			default:
				cc.error(`Unknown state: ${this.state}`);
		}
	},
});
