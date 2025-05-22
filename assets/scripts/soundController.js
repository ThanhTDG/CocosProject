// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


var AudioBGM = cc.Class({
    name: "AudioBGM",
    properties: {
        id: -1,
        isPlaying: false,
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        audioSourceBGM: {
            type: cc.AudioClip,
            default: null
        },
        audioSourceClick: {
            type: cc.AudioClip,
            default: null
        },
        audioBGM: {
            default: null,
            type: AudioBGM
        },
        audioClickId: {
            default: null,
            type: Number
        },
        spriteButtonSet: {
            default: null,
            type: cc.Sprite
        },
        spriteFramePause: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFramePlay: {
            default: null,
            type: cc.SpriteFrame
        },

    },

    onLoad() {
        this._startBGM()
        // this.audioBGM = new AudioBGM();
        // this.onClickPlayBGM()
    },

    start() {

    },
    clickPlaySound() {
        this.playSoundClick();
    },


    playSoundClick() {
        this.audioClickId = cc.audioEngine.play(this.audioSourceClick, false, 1);
    },
    onClickPlayBGM() {
        if (this.audioBGM.id === -1) {
            this._startBGM();
            this.audioBGM.isPlaying = true;
        } else if (this.audioBGM.isPlaying) {
            this._pauseBGM();
            this.audioBGM.isPlaying = false;
        } else {
            this._resumeBGM();
            this.audioBGM.isPlaying = true;
        }
        this._setSpriteButton();
        console.log("BGM is playing: ", this.audioBGM.id);
    },
    _setSpriteButton() {
        if (this.isBGMPlaying) {
            this.spriteButtonSet.spriteFrame = this.spriteFramePause;
        } else {
            this.spriteButtonSet.spriteFrame = this.spriteFramePlay;
        }
    },

    _startBGM() {
        this.audioBGM.id = cc.audioEngine.play(this.audioSourceBGM, true, 1);
        console
    },

    _pauseBGM() {
        cc.audioEngine.pause(this.audioBGM.id);
    },

    _resumeBGM() {
        cc.audioEngine.resume(this.audioBGM.id);
    },
    _stopBGM() {
        cc.audioEngine.stop(this.audioBGM.id);
    },
    _setVolumeBGM(volume) {
        cc.audioEngine.setVolume(this.audioBGM.id, volume);
    },
    _getCurrentVolumeBGM() {
        return cc.audioEngine.getVolume(this.audioBGM.id);
    },
    _changeVolume(delta) {
        let currentVolume = cc.audioEngine.getVolume(this.audioBGM.id);
        let newVolume = this._clampVolume(currentVolume + delta);
        this._setVolumeBGM(newVolume);
    },
    _clampVolume(volume) {
        return Math.max(0, Math.min(volume, 1));
    },
    onClickIncreaseVolume() {
        this._changeVolume(0.1);
    },
    onClickDecreaseVolume() {
        this._changeVolume(-0.1);
    },

    // update (dt) {},
});
