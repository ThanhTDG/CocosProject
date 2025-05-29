export const randomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		let randomNumber = Math.floor(Math.random() * 16);
		color += letters[randomNumber];
	}
	return color;
};
export const ccColor = () => {
	const randomColor = new cc.Color(
		Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256),
		Math.floor(Math.random() * 256)
	);
	return randomColor;
};
export const randomId = (length = 10) => {
	let result = randomColor().replace("#", "");
	return `${result}_${Date.now()}`.slice(0, length);
}