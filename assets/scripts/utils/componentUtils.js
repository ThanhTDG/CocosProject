export function getChildComponent(parentNode, childName, componentType) {
	const child = parentNode.getChildByName(childName);
	if (!child) {
		throw new Error(`Node '${childName}' not found.`);
	}
	const component = child.getComponent(componentType);
	if (!component) {
		throw new Error(
			`Component '${componentType.name}' not found on node '${childName}'.`
		);
	}
	return component;
}

export function instantiatePrefab(prefab, parentNode, name) {
	if (!prefab) {
		throw new Error("Prefab is required for instantiation.");
	}
	const instance = cc.instantiate(prefab);
	instance.name = name || prefab.name;
	if (!instance) {
		throw new Error("Failed to instantiate prefab.");
	}
	if (parentNode) {
		instance.parent = parentNode;
	}
	return instance;
}