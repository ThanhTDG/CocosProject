export function calculateCircularPosition(originalPosition, radius, angle) {
	const x = originalPosition.x + radius * Math.cos((angle * Math.PI) / 180);
	const y = originalPosition.y + radius * Math.sin((angle * Math.PI) / 180);
	return { x, y };
}
