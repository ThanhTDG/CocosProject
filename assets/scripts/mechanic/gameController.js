const Emitter = require("../events/mEmitter");
const GameEventKeys = require("../events/keys/gameEventKeys");
cc.Class({
	extends: require("../events/eventController"),

	properties: {},
	onLoad() {
		this._super();
		this.initialize();
	},
	start() {
		this.startGame();
	},
	initialize() {
		cc.director.getCollisionManager().enabled = true;
	},
	startGame() {
		this.emitScenario();
	},
	emitScenario() {
		this.emitEvent(
			GameEventKeys.START_ENEMY_SPAWN,
			require("../dataTest/scenario").scenarioTest
		);
	},
	emitEvent(...args) {
		Emitter.instance.emit(...args);
	},
});
