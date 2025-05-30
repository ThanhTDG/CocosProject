const { getChildComponent } = require("../../utils/componentUtils");
const TypeSoundSystem = require("./typeSoundSystem");
const { ControllerType, controllerUtils } = require("../utils/controllerUtils");
const Emitter = require("../../events/mEmitter");
const { withClickEffect } = require("../../sound/effectWrapper");
const SoundEventKeys = require("../../events/keys/soundEventKeys");

cc.Class({
	extends: require("../../events/eventController"),

	properties: {
		soundType: {
			default: TypeSoundSystem.MASTER,
			type: cc.Enum(TypeSoundSystem),
			tooltip: "Type of sound system (default: TypeSoundSystem.MASTER)",
		},
		labelValue: {
			default: null,
			type: cc.Label,
			tooltip: "Label to display the volume value",
		},
	},

	onLoad() {
		this._super();
		this.initialize();
	},

	onSliderChange() {
		const slider = this.getSlider();
		if (slider) {
			this.updateStateVolume(slider.progress);
			this.updateLabelValue();
			this.emitStateChanged();
		}
	},

	onToggleChange() {
		const toggle = this.getToggle();
		if (toggle) {
			this.state.isEnabled = toggle.isChecked;
			this.emitStateChanged();
			withClickEffect(() => { })();
		}
	},

	loadDefault() {
		const defaultState = this.controller.loadDefault(this.soundType);
		this.state = defaultState;
		this.updateUi();
	},

	initialize() {
		this.emitRequestSoundState();
		this.registerDefaultSound();
	},
	emitStateChanged() {
		let KEY_EVENT = `${SoundEventKeys.SOUND_STATE_CHANGED}_${this.soundType}`;
		Emitter.instance.emit(KEY_EVENT, this.state);
	},
	emitRequestSoundState() {
		let KEY_EVENT = `${SoundEventKeys.GET_SOUND_STATE}_${this.soundType}`;
		Emitter.instance.emit(KEY_EVENT, (state) => {
			this.onReceiveState(state);
		});
	},
	registerDefaultSound() {
		let KEY_EVENT = `${SoundEventKeys.SOUND_STATE_CHANGED}_${this.soundType}`;
		this.registerEvent(KEY_EVENT, (state) => {
			this.onReceiveState(state);
		});
	},
	onReceiveState(state) {
		if (!state) {
			throw new Error("State is not provided.");
		}
		this.state = state;
		this.updateUi();
	},
	updateUi() {
		this.updateToggleState();
		this.updateSliderProgress();
		this.updateLabelValue();
	},
	updateStateVolume(volume) {
		if (!this.state) {
			throw new Error("State is not initialized.");
		}
		this.state.volume = volume;
		this.emitStateChanged();
	},
	updateToggleState() {
		const toggle = this.getToggle();
		if (toggle) {
			toggle.isChecked = this.state.isEnabled;
		}
	},
	updateSliderProgress() {
		const slider = this.getSlider();
		if (slider) {
			slider.progress = this.state.volume;
		}
	},

	updateLabelValue() {
		const label = this.getLabelValue();
		if (label) {
			label.string = this.state.volumeToString();
		}
	},
	getToggle() {
		const toggle = getChildComponent(this.node, "toggle", cc.Toggle);
		return toggle;
	},
	getSlider() {
		const slider = getChildComponent(this.node, "slider", cc.Slider);
		return slider;
	},
	getLabelValue() {
		if (!this.labelValue) {
			throw new Error("Label for value not found.");
		}
		return this.labelValue;
	},
});
