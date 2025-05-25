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
