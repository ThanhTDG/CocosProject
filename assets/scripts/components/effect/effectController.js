const EffectBase = require("./effectBase");
const EventKeys = require("../../events/keys/effectEventKeys");
const { EffectItem } = require("./effectItem");
cc.Class({
	extends: require("eventController"),

	properties: {
		effectPrefabs: {
			default: [],
			type: [cc.Prefab],
			tooltip: "Prefab for the effect",
		},
	},

	onLoad() {
		this._super();
		this.initialize();
	},
	initialize() {
		this.prefabMap = new Map();
		this.effects = [];

		this.initializePrefabMap();
		this.registerEvents();
	},
	initializePrefabMap() {
		for (let i = 0; i < this.effectPrefabs.length; i++) {
			const prefab = this.effectPrefabs[i];
			const effect = prefab.data.getComponent(EffectBase);
			if (effect && effect.effectType) {
				this.prefabMap.set(effect.effectType, prefab);
			} else {
				cc.warn(
					`Prefab at index ${i} does not have a valid EffectBase component.`
				);
			}
		}
	},

	registerEvents() {
		this.registerEvent(EventKeys.SPAWN_EFFECT, this.spawn.bind(this));
		this.registerEvent(EventKeys.CLEAR_EFFECTS, this.clear.bind(this));
	},

	spawn(effectItem) {
		if (!(effectItem instanceof EffectItem)) {
			cc.error("Invalid effect item.");
			return;
		}
		const { worldPosition, effectType } = effectItem;
		const prefab = this.getPrefab(effectType);
		if (!prefab) {
			cc.error(`Prefab with type "${effectType}" not found.`);
			return;
		}
		const localPosition = this.node.convertToNodeSpaceAR(worldPosition);
		const node = this.createNode(prefab, localPosition);
		const scriptComponent = node.getComponent(EffectBase);
		this.playEffect(scriptComponent);
	},

	getPrefab(effectType) {
		const prefab = this.prefabMap.get(effectType);
		if (!prefab) {
			cc.error(`Prefab with type "${effectType}" not found.`);
			return null;
		}
		return prefab;
	},

	createNode(prefab, position) {
		const node = cc.instantiate(prefab);
		node.setPosition(position);
		this.node.addChild(node);

		const effect = node.getComponent(EffectBase);
		if (effect) {
			this.effects.push(effect);
		}
		return node;
	},

	playEffect(effect) {
		const isExited = effect && effect.playEffect;
		if (!isExited) {
			cc.error("Effect does not have a playEffect method.");
		}
		effect.playEffect();
		this.scheduleDestruction(effect);
	},

	scheduleDestruction(effect) {
		const needCancel = effect.duration > 0;
		if (!needCancel) {
			return;
		}
		this.scheduleOnce(() => {
			this.removeEffect(effect);
		}, effect.duration);
	},

	removeEffect(effect) {
		const index = this.effects.indexOf(effect);
		if (index !== -1) {
			this.effects.splice(index, 1);
		}
		effect.destroyEffect();
	},

	clear() {
		while (this.effects.length > 0) {
			const effect = this.effects.pop();
			effect.destroyEffect();
		}
	},
});
