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
        font1: {
            default: null,
            type: cc.Font
        },
        font2: {
            default: null,
            type: cc.Font
        },
        currentFontIndex: {
            default: 0,
            type: cc.Integer
        }
    },

    start() {

    },
    onLoad() {
        this._init();
    },
    _init() {
        this.fonts = [this.font1, this.font2];
        this._applyFont();
        this.displayFontSizeChange();
    },
    onClickChangeFont() {
        let hasFont = this.fonts.length > 0;
        if (hasFont) {
            this.currentFontIndex = (this.currentFontIndex + 1) % this.fonts.length;
            this._applyFont();
        }
        this.displayFontSizeChange()
    },
    _applyFont() {
        let label = this._getLabel();
        let hasFont = this.fonts.length > 0;
        if (hasFont) {
            label.font = this.fonts[this.currentFontIndex];
        }
    },
    displayFontSizeChange() {
        let label = this._getLabel();
        label.string = `Font: ${label.font.name}`;
    },

    _getLabel() {
        let label = this.getComponent(cc.Label);
        return label;
    }
});
