const { ControllerType, controllerUtils } = require("../utils/controllerUtils");
const PopupType = require("./popupType");
cc.Class({
	extends: cc.Component,

	properties: {
		typePopup: {
			default: PopupType.SETTING,
			type: cc.Enum(PopupType),
			tooltip: "Type of popup to close (default: 'close')",
		},
	},

	onClickClosePopup() {
		const popupController = this.getPopupController();
		switch (this.typePopup) {
			case PopupType.SETTING:
				popupController.onClickHideSetting();
				break;
			case PopupType.RANK:
				popupController.onClickHideRank();
				break;
		}
	},
	getPopupController() {
		return controllerUtils.getController(ControllerType.POPUP);
	},
});
