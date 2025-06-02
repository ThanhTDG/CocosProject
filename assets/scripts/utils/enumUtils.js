export function validateEnum(enumObj, value) {
	if (!enumObj || typeof enumObj !== "object") {
		throw new Error("Invalid enum object provided.");
	}
	if (!Object.values(enumObj).includes(value)) {
		throw new Error(`Value "${value}" is not a valid enum value.`);
	}
	return value;
}
