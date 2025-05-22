// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        this.playBGM();
    },
    clickPlaySound() {
        this.playSoundClick();
    },

    playSoundClick() {
        this.audioClick = cc.audioEngine.play(this.audioSourceClick, false, 1);
        console.log("click sound", this);
    },
    playBGM() {
        this.audioBGM = cc.audioEngine.play(this.audioSourceBGM, true, 1);
    }

    // update (dt) {},
});
