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
        prefabSetting: {
            default: null,
            type: cc.Prefab,
            tooltip: 'Prefab for popup setting',
        },
        nodeSetting: null,
    },
    onLoad() {
        let nodeSetting = cc.instantiate(this.prefabSetting);
        nodeSetting.parent = this.node;
        this.popupSetting = nodeSetting.getComponent('popupSetting');
    },


    onClickShowRank() {
        this.popupRank.show();
    },
    onClickHideRank() {
        this.popupRank.hide();
    },

    onClickShowSetting() {
        this.popupSetting.show();
    },
    onClickHideSetting() {
        this.popupSetting.hide();
    },


});
