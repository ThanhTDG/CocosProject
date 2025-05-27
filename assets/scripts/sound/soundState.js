
export class SoundState {
	constructor(volume = 1.0, isEnabled = true) {
		this.setVolume(volume);
		this.isEnabled = isEnabled;
	}

	volumeToString() {
		return (this.volume * 100).toFixed(0);
	}

	canPlay() {
		return this.isEnabled && this.volume > 0.0;
	}

	setVolume(volume) {
		this.volume = this.validateVolume(volume);
	}

	validateVolume(volume) {
		if (volume < 0.0 || volume > 1.0) {
			throw new Error("Volume must be between 0.0 and 1.0");
		}
		return volume;
	}

	isEqual(other) {
		if (!(other instanceof SoundState)) {
			throw new Error("other must be an instance of SoundState");
		}
		let isEqualVolume = this.isEqualVolume(other);
		let isEqualEnabled = this.isEqualEnabled(other);
		let isEqual = isEqualVolume && isEqualEnabled;
		return isEqual;
	}

	isEqualVolume(other) {
		return this.volume === other.volume;
	}

	isEqualEnabled(other) {
		return this.isEnabled === other.isEnabled;
	}
	clone() {
		return new SoundState(this.volume, this.isEnabled);
	}
}
export class SoundStateManager {
	static _instance = null;
	constructor() {
		this.mapState = new Map();
		this.mapDefaultState = new Map();
	}

	static get instance() {
		if (!SoundStateManager._instance) {
			SoundStateManager._instance = new SoundStateManager();
		}
		return SoundStateManager._instance;
	}

	addSoundDefaultState(soundType, soundState) {
		let isDefined = this.mapDefaultState.has(soundType);
		if (isDefined) {
			throw new Error(`Sound type ${soundType} is already defined in default state.`);
		}
		let isSoundState = soundState instanceof SoundState;
		if (!isSoundState) {
			throw new Error("soundState must be an instance of SoundState");
		}
		this.mapDefaultState.set(soundType, soundState);
	}

	setMapByDefaultState() {
		this.mapState.clear();
		for (const [key, value] of this.mapDefaultState.entries()) {
			this.mapState.set(key, value.clone());
		}
	}
	getMapState() {
		if (this.mapState.size === 0) {
			this.setMapByDefaultState();
		}
		return this.mapState;
	}

	valiteHasSoundType(soundType) {
		let hasType = this.mapState.has(soundType);
		if (!hasType) {
			throw new Error(`Sound type ${soundType} is not defined in state.`);
		}
		return hasType;
	}

	getSoundState(soundType) {
		return this.mapState.get(soundType).clone();
	}
	isEqual(soundType, soundState) {
		this.validateHasSoundType(soundType);
		const currentState = this.mapState.get(soundType);
		return currentState.isEqual(soundState);
	}

	updateState(soundType, soundState) {
		if (!this.isEqual(soundType, soundState)) {
			this.mapState.set(soundType, soundState);
		}
	}

	setSoundState(soundType, soundState) {
		this.valiteHasSoundType(soundType);
		this.mapState.set(soundType, soundState);
	}
	resetSoundState(soundType) {
		this.valiteHasSoundType(soundType);
		this.mapState.set(soundType, this.mapDefaultState.get(soundType).clone());
	}
}
