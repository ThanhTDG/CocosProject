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
        fontSize: {
            default: 40,
            type: cc.Integer
        },
    },
    start() {
        this.displayFontSizeChange();
    },

    _setFontSize(size) {
        let label = this._getLabel();
        let currentHeight = label.lineHeight;
        let isLager = size > currentHeight;
        if (isLager) {
            this._setLineHeight(size);
        }
        label.fontSize = size;
    },
    _setLineHeight(height) {
        let label = this._getLabel();
        label.lineHeight = height
    },
    onClickIncreaseFontSize() {
        this.fontSize += 2;
        this._setFontSize(this.fontSize);
    },

    onClickDecreaseFontSize() {
        this.fontSize -= 2;
        this._setFontSize(this.fontSize);
    },
    onClickResetFontSize() {
        this.fontSize = 40;
        this._setFontSize(this.fontSize);
    },
    displayFontSizeChange() {
        let label = this._getLabel();
        let currentSize = label.fontSize;
        label.string = `Font Size: ${currentSize}`;
    },
    _getLabel() {
        let label = this.getComponent(cc.Label);
        return label;
    }



});
