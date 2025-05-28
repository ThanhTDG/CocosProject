const { withClickEffect } = require("../sound/effectWrapper");
const Emitter = require("../events/mEmitter");
const PopupEventKeys = require("../events/keys/popupEventKeys");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onClickOpenRank() {
        withClickEffect(() => this.openRankingPopup())();
    },
    onClickOpenSetting() {
        withClickEffect(() => this.openSettingPopup())();
    },
    openRankingPopup() {
        Emitter.instance.emit(PopupEventKeys.OPEN_RANKING_POPUP);
    },
    openSettingPopup() {
        Emitter.instance.emit(PopupEventKeys.OPEN_SETTING_POPUP);
    }

});
