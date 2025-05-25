const TypeSound = require("./typeSoundSystem");
const SoundState = require("./soundState").SoundState;
cc.Class({
	extends: cc.Component,

	properties: {
		isEnableMaster: {
			default: true,
			tooltip: "Enable or disable master sound (default: true)",
		},
		volumeMaster: {
			default: 0.75,
			tooltip: "Volume for master sound (default: 0.75)",
		},
		isEnableMusic: {
			default: true,
			tooltip: "Enable or disable music sound (default: true)",
		},
		volumeMusic: {
			default: 0.75,
			tooltip: "Volume for music sound (default: 0.75)",
		},
		isEnableEffect: {
			default: true,
			tooltip: "Enable or disable effect sound (default: true)",
		},
		volumeEffect: {
			default: 0.75,
			tooltip: "Volume for effect sound (default: 0.75)",
		},
		musicSource: {
			default: null,
			type: cc.AudioClip,
			tooltip: "Audio clip for background music",
		},
		clickAudioSource: {
			default: null,
			type: cc.AudioClip,
			tooltip: "Default audio clip for click effects",
		},
	},

	onLoad() {
		this.initializeSoundConfig();
		this.playBackgroundMusic();
	},

	clickEffect() {
		let clickEffect = this.clickAudioSource;
		this.playEffect(clickEffect);
	},

	playEffect(audioClip) {
		this.playSound(TypeSound.EFFECT, audioClip, false);
	},

	playMusic(audioClip) {
		this.musicId = this.playSound(TypeSound.MUSIC, audioClip, true);
	},

	getState(soundType) {
		if (!this.mapSoundState.has(soundType)) {
			throw new Error("Invalid sound type: " + soundType);
		}
		return this.mapSoundState.get(soundType).clone();
	},

	setState(type, state) {
		const oldState = this.getState(type);
		if (oldState.isEnable !== state.isEnable) {
			this.handleEnableState(type, state.isEnable);
		}
		if (oldState.volume !== state.volume) {
			this.handleVolumeChange(type, state.volume);
		}
		this.updateState(type, new SoundState(state.volume, state.isEnable));
	},

	handleEnableState(type, isEnable) {
		switch (type) {
			case TypeSound.MASTER:
				this.handleMasterEnableState(isEnable);
				break;
			case TypeSound.MUSIC:
				this.handleMusicEnableState(isEnable);
				break;
			default:
				break;
		}
	},

	handleMasterEnableState(isEnable) {
		if (isEnable) {
			this.resumeAll();
		} else {
			this.pauseAll();
		}
	},

	handleMusicEnableState(isEnable) {
		if (!this.isValidMusicId()) {
			throw new Error("Music ID is not set. Cannot handle MUSIC state.");
		}
		if (isEnable) {
			this.resume(this.musicId);
		} else {
			this.pauseSound(this.musicId);
		}
	},

	handleVolumeChange(type, newVolume) {
		switch (type) {
			case TypeSound.MASTER:
				this.handleMasterVolumeChange(newVolume);
				break;
			case TypeSound.MUSIC:
				this.handleMusicVolumeChange(newVolume);
				break;
			default:
				break;
		}
	},

	updateVolumeForMusic(baseVolume, targetVolume) {
		if (!this.isValidMusicId()) {
			throw new Error(
				"Music ID is not set or invalid. Cannot update music volume."
			);
		}
		const calculatedVolume = this.calculateVolume(baseVolume, targetVolume);
		this.setVolume(this.musicId, calculatedVolume);
	},

	handleMasterVolumeChange(masterVolume) {
		const musicState = this.getState(TypeSound.MUSIC);
		this.updateVolumeForMusic(masterVolume, musicState.volume);
	},

	handleMusicVolumeChange(newVolume) {
		const masterVolume = this.getState(TypeSound.MASTER).volume;
		this.updateVolumeForMusic(masterVolume, newVolume);
	},

	updateState(soundType, soundState) {
		if (!this.mapSoundState.has(soundType)) {
			throw new Error("Invalid sound type: " + soundType);
		}
		if (!(soundState instanceof SoundState)) {
			throw new Error("soundState must be an instance of SoundState");
		}
		this.mapSoundState.set(soundType, soundState);
	},

	initializeSoundConfig() {
		const defaultMap = this.createDefaultMap();
		this.defaultMapState = defaultMap;
		this.mapSoundState = new Map(defaultMap);
		this.musicId = -1;
	},

	loadDefault(type) {
		if (!this.defaultMapState.has(type)) {
			throw new Error("Invalid sound type: " + type);
		}
		const defaultState = this.defaultMapState.get(type).clone();
		this.setState(type, defaultState);
		return defaultState;
	},

	createDefaultMap() {
		return new Map([
			[
				TypeSound.MASTER,
				new SoundState(this.volumeMaster, this.isEnableMaster),
			],
			[TypeSound.MUSIC, new SoundState(this.volumeMusic, this.isEnableMusic)],
			[
				TypeSound.EFFECT,
				new SoundState(this.volumeEffect, this.isEnableEffect),
			],
		]);
	},

	playBackgroundMusic() {
		if (!this.musicSource) {
			throw new Error("Music source is not set. Cannot play background music.");
		}
		this.playMusic(this.musicSource);
	},

	playSound(type, audioClip, loop = false) {
		const master = this.getState(TypeSound.MASTER);
		const sound = this.getState(type);
		const canPlay = sound.canPlay() && master.canPlay();
		if (!canPlay) {
			return;
		}
		const volume = this.calculateVolume(master.volume, sound.volume);
		return this.playRawAudio(audioClip, volume, loop);
	},

	playRawAudio(audioClip, volume = 1.0, loop = true) {
		if (!(audioClip instanceof cc.AudioClip)) {
			throw new Error("audioClip must be an instance of cc.AudioClip");
		}
		return cc.audioEngine.play(audioClip, loop, volume);
	},

	calculateVolume(masterVolume, itemVolume) {
		return masterVolume * itemVolume;
	},

	isValidMusicId() {
		return this.musicId !== -1;
	},

	stopAll() {
		cc.audioEngine.stopAll();
	},

	stopSound(id) {
		cc.audioEngine.stop(id);
	},

	setVolume(id, volume) {
		cc.audioEngine.setVolume(id, volume);
	},

	pauseAll() {
		cc.audioEngine.pauseAll();
	},

	resume(id) {
		cc.audioEngine.resume(id);
	},

	pauseSound(id) {
		cc.audioEngine.pause(id);
	},

	resumeAll() {
		cc.audioEngine.resumeAll();
	},
});
