const { ControllerType, controllerUtils } = require("../utils/controllerUtils");

function withClickEffect(handler) {
	return function (...args) {
		const soundController = controllerUtils.getController(ControllerType.SOUND);
		if (soundController && typeof soundController.clickEffect === "function") {
			soundController.clickEffect();
		}
		handler.apply(this, args);
	};
}

module.exports = { withClickEffect };
