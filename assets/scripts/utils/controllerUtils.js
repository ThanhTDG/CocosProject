const ControllerType = {
	POPUP: "popupController",
	SOUND: "soundController",
};

const controllerPaths = {
	[ControllerType.POPUP]: {
		path: "canvas/popupController",
		component: "popupController",
	},
	[ControllerType.SOUND]: {
		path: "canvas/soundController",
		component: "soundSystemController",
	},
};

function getComponentFromNode(nodePath, componentName) {
	const node = cc.find(nodePath);
	if (!node) {
		throw new Error(`Node not found at path: ${nodePath}`);
	}

	const component = node.getComponent(componentName);
	if (!component) {
		throw new Error(
			`Component '${componentName}' not found on node at path: ${nodePath}`
		);
	}

	return component;
}

const controllerUtils = {
	getController(controllerType) {
		const controllerInfo = controllerPaths[controllerType];
		if (!controllerInfo) {
			throw new Error(`Controller '${controllerType}' is not defined.`);
		}
		return getComponentFromNode(controllerInfo.path, controllerInfo.component);
	},
};

module.exports = { controllerUtils, ControllerType };
