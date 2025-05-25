export class SoundState {
	constructor(volume = 1.0, isEnable = true) {
		this.setVolume(volume);
		this.isEnable = isEnable;
	}

	volumeToString() {
		return (this.volume * 100).toFixed(0);
	}

	canPlay() {
		return this.isEnable && this.volume > 0.0;
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
	clone() {
		return new SoundState(this.volume, this.isEnable);
	}
}
