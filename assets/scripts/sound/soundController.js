const TypeSound = require("./typeSoundSystem");
const { SoundState, SoundStateManager } = require("./soundState");
const PopupKeySound = require('../events/keys/soundEventKeys');
const Emitter = require("../events/mEmitter");

cc.Class({
	extends: require("../events/eventController"),

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
		this._super();
		this.initializeSoundConfig();
		this.playBackgroundMusic();
		this.registerEvents();
	},

	registerEvents() {
		this.registerSoundChangedEvent(TypeSound.MASTER, this.handleMasterChanged);
		this.registerSoundChangedEvent(TypeSound.MUSIC, this.handleMusicChanged);
		this.registerSoundChangedEvent(TypeSound.EFFECT, this.handleEffectChanged);
		this.registerLoadDefaultSound();
		this.registerGetSoundStateEvent(TypeSound.MASTER);
		this.registerGetSoundStateEvent(TypeSound.MUSIC);
		this.registerGetSoundStateEvent(TypeSound.EFFECT);
		this.registerClickEffect();
	},
	registerLoadDefaultSound() {
		this.registerEvent(PopupKeySound.LOAD_DEFAULT_SOUND, this.setAllDefault.bind(this));
	},
	setAllDefault() {
		SoundStateManager.instance.setMapByDefaultState();
		const types = [TypeSound.MASTER, TypeSound.MUSIC, TypeSound.EFFECT];
		types.forEach(type => {
			this.emitSoundStateChanged(type, this.getState(type));
		});
		this.volumeMaster = SoundStateManager.instance.getSoundState(TypeSound.MASTER).volume;
		this.volumeMusic = SoundStateManager.instance.getSoundState(TypeSound.MUSIC).volume;
		this.updateVolumeForMusic(this.volumeMaster, this.volumeMusic);
	},
	emitSoundStateChanged(type, state) {
		const key = `${PopupKeySound.SOUND_STATE_CHANGED}_${type}`;
		Emitter.instance.emit(key, state);
	},
	registerGetSoundStateEvent(type) {
		const key = `${PopupKeySound.GET_SOUND_STATE}_${type}`;
		this.registerEvent(key, (callback) => {
			if (typeof callback === 'function') {
				callback(this.getState(type));
			}
		});
	},
	registerSoundChangedEvent(type, handler) {
		const key = `${PopupKeySound.SOUND_STATE_CHANGED}_${type}`;
		this.registerEvent(key, handler.bind(this));
	},
	registerClickEffect() {
		this.registerEvent(PopupKeySound.PLAY_CLICK_SOUND, this.clickEffect.bind(this));
	},
	handleMasterChanged(state) {
		this.handleChanged(TypeSound.MASTER, state);
	},
	handleMusicChanged(state) {
		this.handleChanged(TypeSound.MUSIC, state);
	},
	handleEffectChanged(state) {
		this.handleChanged(TypeSound.EFFECT, state);
	},
	handleChanged(type, state) {
		this.validateSoundState(state);
		const oldState = this.getState(type);
		if (!oldState.isEqual(state)) {
			this.handleStateChange(type, oldState, state);
			this.updateState(type, state);
		}
	},
	handleGetSoundState(type) {
		return this.getState(type);
	},
	handleStateChange(type, oldState, newState) {
		if (oldState.isEnabled !== newState.isEnabled) {
			this.handleEnable(type, newState.isEnabled);
		}
		if (oldState.volume !== newState.volume) {
			this.handleVolume(type, newState.volume);
		}
	},

	handleEnable(type, isEnable) {
		switch (type) {
			case TypeSound.MASTER:
				if (isEnable) {
					this.resumeAll();
				} else {
					this.pauseAll();
				}
				break;
			case TypeSound.MUSIC:
				if (isEnable) {
					this.resume(this.musicId);
				} else {
					this.pause(this.musicId);
				}
				break;
			default:
				break;
		}
	},

	handleVolume(type, newVolume) {
		if (type === TypeSound.MASTER) {
			const musicState = this.getState(TypeSound.MUSIC);
			this.updateVolumeForMusic(newVolume, musicState.volume);
		} else if (type === TypeSound.MUSIC) {
			const masterVolume = this.getState(TypeSound.MASTER).volume;
			this.updateVolumeForMusic(masterVolume, newVolume);
		}
	},
	initializeSoundConfig() {
		this.setDefaultState(TypeSound.MASTER, this.volumeMaster, this.isEnableMaster);
		this.setDefaultState(TypeSound.MUSIC, this.volumeMusic, this.isEnableMusic);
		this.setDefaultState(TypeSound.EFFECT, this.volumeEffect, this.isEnableEffect);
		this.musicId = -1;
		this.clickId = -1;
	},
	setDefaultState(type, volume, isEnable) {
		SoundStateManager.instance.addSoundDefaultState(
			type,
			new SoundState(volume, isEnable)
		);
	},
	getState(soundType) {
		return SoundStateManager.instance.getSoundState(soundType);
	},

	updateState(type, state) {
		SoundStateManager.instance.updateState(type, state.clone());
	},
	validateSoundState(state) {
		if (!(state instanceof SoundState)) {
			throw new Error("state must be an instance of SoundState");
		}
	},
	playBackgroundMusic() {
		if (!this.musicSource) throw new Error("Music source is not set. Cannot play background music.");
		this.playMusic(this.musicSource);
	},
	playMusic(audioClip) {
		this.musicId = this.playSound(TypeSound.MUSIC, audioClip, true);
	},
	playEffect(audioClip) {
		this.playSound(TypeSound.EFFECT, audioClip, false);
	},
	clickEffect() {
		this.playEffect(this.clickAudioSource);
	},
	playSound(type, audioClip, loop = false) {
		const master = this.getState(TypeSound.MASTER);
		const sound = this.getState(type);
		if (!sound.canPlay() || !master.canPlay()) return;
		const volume = this.calculateVolume(master.volume, sound.volume);
		return this.playRawAudio(audioClip, volume, loop);
	},
	playRawAudio(audioClip, volume = 1.0, loop = true) {
		if (!(audioClip instanceof cc.AudioClip)) {
			throw new Error("audioClip must be an instance of cc.AudioClip");
		}
		return cc.audioEngine.play(audioClip, loop, volume);
	},
	updateVolumeForMusic(masterVolume, musicVolume) {
		if (!this.isValidMusicId()) return;
		const calculatedVolume = this.calculateVolume(masterVolume, musicVolume);
		this.setVolume(this.musicId, calculatedVolume);
	},
	calculateVolume(masterVolume, itemVolume) {
		return masterVolume * itemVolume;
	},
	isValidMusicId() {
		return this.musicId !== -1;
	},
	stopAll() {
		this.musicId = -1;
		this.clickId = -1;
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
	pause(id) {
		cc.audioEngine.pause(id);
	},
	resumeAll() {
		cc.audioEngine.resumeAll();
	},
});
