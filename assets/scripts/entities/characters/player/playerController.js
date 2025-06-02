const EventController = require("events/eventController");
const { Stats } = require("../stats");
const Player = require("./player");
const Emitter = require("../../../events/mEmitter");
const { InitBullet } = require("../../bullet/initBullet");
const { BulletType } = require("../../bullet/bulletType");
const BulletEventKeys = require("../../../events/keys/bulletEventKeys");
const { PlayerStats } = require("./playerStats");
cc.Class({
	extends: EventController,

	properties: {
		playerPrefab: {
			default: null,
			type: cc.Prefab,
			tooltip: "Prefab for the player character",
		},

	},

	onLoad() {
		this._super();
		this.initialize();
		this.testShoots();
	},
	testShoots() {
		this.schedule(this.testShoot, 3);
	},
	testShoot() {
		let initBullet = new InitBullet({
			direction: cc.v2(1, 0),
			worldPosition: cc.v2(0, 500),
			bulletType: BulletType.Normal,
		})
		Emitter.instance.emit(BulletEventKeys.SPAWN_BULLET, initBullet);
	},

	initialize() {
		this.player = null;
		this.spawnPlayer();
	},

	spawnPlayer(level = 1, worldPosition = null) {
		const node = this.createPlayerNode();
		const playerScript = this.getPlayerScript(node);
		if (!playerScript) return;
		this.initStats(playerScript, level);
		this.addPlayerToScene(node);
		this.setPlayerPosition(playerScript, worldPosition);
		this.player = playerScript;
	},

	createPlayerNode() {
		return cc.instantiate(this.playerPrefab);
	},

	getPlayerScript(node) {
		const script = node.getComponent(Player);
		if (!script) {
			cc.error("Player script not found on prefab!");
			return null;
		}
		return script;
	},

	addPlayerToScene(node) {
		this.node.addChild(node);
	},

	setPlayerPosition(playerScript, worldPosition) {
		if (worldPosition) {
			const localPosition = this.node.convertToNodeSpaceAR(worldPosition);
			playerScript.setPosition(localPosition);
		}
	},

	initStats(playerScript, level) {
		const stats = new PlayerStats(level);
		playerScript.setStats(stats);
	},


});