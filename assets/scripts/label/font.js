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
        fonts: {
            default: [],
            type: [cc.Font]
        },
        currentFontIndex: {
            default: 0,
            type: cc.Integer
        }
    },

    start() {

    },


    onClickChangeFont() {
        if (this.fonts.length > 0) {
            this.currentFontIndex = (this.currentFontIndex + 1) % this.fonts.length;
            this._applyFont();
            console.log(`Font changed to index: ${this.currentFontIndex}`);
        } else {
            console.warn('Font array is empty!');
        }
    },
    _applyFont() {
        let label = this._getLabel();
        if (this.fonts.length > 0) {
            label.font = this.fonts[this.currentFontIndex];
        } else {
        }
    },

    _getLabel() {
        let label = this.getComponent(cc.Label);
        return label;
    }
});
