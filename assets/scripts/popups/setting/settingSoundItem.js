const { getChildComponent } = require("../../utils/componentUtils");
const TypeSoundSystem = require("./typeSoundSystem");
const { ControllerType, controllerUtils } = require("../utils/controllerUtils");

cc.Class({
	extends: cc.Component,

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
		this.initialize();
	},

	onSliderChange() {
		const slider = this.getSlider();
		if (slider) {
			this.updateStateVolume(slider.progress);
			this.updateLabelValue();
			this.controller.clickEffect();
		}
	},

	onToggleChange() {
		const toggle = this.getToggle();
		if (toggle) {
			this.state.isEnable = toggle.isChecked;
			this.controller.setState(this.soundType, this.state);
			this.controller.clickEffect();
		}
	},

	loadDefault() {
		const defaultState = this.controller.loadDefault(this.soundType);
		this.state = defaultState;
		this.updateUi();
	},

	initialize() {
		this.initializeController();
		this.getStateFromController();
		this.updateUi();
	},

	initializeController() {
		this.controller = controllerUtils.getController(ControllerType.SOUND);
	},

	getStateFromController() {
		if (!this.controller) {
			throw new Error("Controller is not initialized.");
		}

		this.state = this.controller.getState(this.soundType);
		if (!this.state) {
			throw new Error(
				`State for sound type ${this.soundType} is not available.`
			);
		}
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
		this.controller.setState(this.soundType, this.state);
	},

	updateToggleState() {
		const toggle = this.getToggle();
		if (toggle) {
			toggle.isChecked = this.state.isEnable;
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
