export function calculateCircularPosition(originalPosition, radius, angle) {
	const x = originalPosition.x + radius * Math.cos((angle * Math.PI) / 180);
	const y = originalPosition.y + radius * Math.sin((angle * Math.PI) / 180);
	return { x, y };
}

export function distanceBetweenPoints(pointA, pointB) {
	return pointB.sub(pointA).mag();
}

export function isVector(obj) {
	return obj instanceof cc.Vec2 || obj instanceof cc.Vec3;
}
export function validateVector(obj) {
	if (!isVector(obj)) {
		throw new Error("Object is not a valid cc.Vec2 instance or ccVec3 .");
	}
	return obj;
}

export function getMoveStepToTarget(current, target, speed, dt) {
	const direction = target.sub(current).normalize();
	return direction.mul(speed * dt);
}

export function isArrived(current, target, moveStep) {
	return current.sub(target).mag() < moveStep.mag();
}

export function getMoveStepByDirection(direction, speed, dt) {
	return direction.normalize().mul(speed * dt);
}