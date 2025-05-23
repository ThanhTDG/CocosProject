cc.Class({
	extends: cc.Component,

	properties: {
		audioSourceBGM: {
			type: cc.AudioClip,
			default: null,
		},
		audioSourceClick: {
			type: cc.AudioClip,
			default: null,
		},
		spriteButtonSet: {
			default: null,
			type: cc.Sprite,
		},
		spriteFramePause: {
			default: null,
			type: cc.SpriteFrame,
		},
		spriteFramePlay: {
			default: null,
			type: cc.SpriteFrame,
		},
		labelVolume: {
			default: null,
			type: cc.Label,
		},
		audioClickId: -1,
		isBGMPlaying: false,
		audioBGMId: -1,
	},

	onLoad() {
		this._playBGM();
		this._setLabelVolume(this._getCurrentVolumeBGM());
	},

	start() {},
	onClickSound() {
		this.playSoundClick();
	},

	playSoundClick() {
		this.audioClickId = cc.audioEngine.play(this.audioSourceClick, false, 1);
	},
	onClickPlayBGM() {
		this._playBGM();
	},
	_playBGM() {
		if (this.audioBGMId === -1) {
			this._startBGM();
			this.isBGMPlaying = true;
		} else if (this.isBGMPlaying) {
			this._pauseBGM();
			this.isBGMPlaying = false;
		} else {
			this._resumeBGM();
			this.isBGMPlaying = true;
		}
		this._setSpriteButton();
	},
	_setSpriteButton() {
		if (this.isBGMPlaying) {
			this.spriteButtonSet.spriteFrame = this.spriteFramePause;
		} else {
			this.spriteButtonSet.spriteFrame = this.spriteFramePlay;
		}
		let node = this.spriteButtonSet.node;
		this._setSize(node, 32, 32);
	},
	_setSize(node, width, height) {
		node.width = width;
		node.height = height;
	},

	_startBGM() {
		this.audioBGMId = cc.audioEngine.play(this.audioSourceBGM, true, 1);
	},

	_pauseBGM() {
		cc.audioEngine.pause(this.audioBGMId);
	},

	_resumeBGM() {
		cc.audioEngine.resume(this.audioBGMId);
	},
	_stopBGM() {
		cc.audioEngine.stop(this.audioBGMId);
	},
	_setVolumeBGM(volume) {
		cc.audioEngine.setVolume(this.audioBGMId, volume);
	},
	_getCurrentVolumeBGM() {
		return cc.audioEngine.getVolume(this.audioBGMId);
	},
	_changeVolume(delta) {
		let currentVolume = cc.audioEngine.getVolume(this.audioBGMId);
		let newVolume = this._clampVolume(currentVolume + delta);
		let roundedVolume = Math.round(newVolume * 10) / 10;
		this._setVolumeBGM(roundedVolume);
	},
	_setLabelVolume(volume) {
		let label = this.labelVolume.getComponent(cc.Label);
		label.string = `BGM Volume: ${Math.round(volume * 100)}%`;
	},
	_clampVolume(volume) {
		return Math.max(0, Math.min(volume, 1));
	},
	onClickIncreaseVolume() {
		this._changeVolume(0.1);
		this._setLabelVolume(this._getCurrentVolumeBGM());
	},
	onClickDecreaseVolume() {
		this._changeVolume(-0.1);
		this._setLabelVolume(this._getCurrentVolumeBGM());
	},

	// update (dt) {},
});
