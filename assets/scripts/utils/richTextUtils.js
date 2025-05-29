export const RAINBOW_COLORS = [
    "#FF0000", "#FF4000", "#FF8000", "#FFBF00", "#FFFF00",
    "#BFFF00", "#80FF00", "#40FF00", "#00FF00",
    "#00FF40", "#00FF80", "#00FFBF", "#00FFFF",
    "#00BFFF", "#0080FF", "#0040FF", "#0000FF",
    "#4000FF", "#8000FF", "#BF00FF", "#FF00FF",
    "#FF00BF", "#FF0080", "#FF0040"
];

export const RAINBOW_SIZES = [
    50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28,
    30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52
];

export function getRainbowRichText(text, colorIndex = 0, sizes = RAINBOW_SIZES, colors = RAINBOW_COLORS) {
    let rich = "";
    for (let i = 0; i < text.length; i++) {
        const size = sizes[(colorIndex + i) % sizes.length];
        const color = colors[(colorIndex + i) % colors.length];
        rich += `<size=${size}><color=${color}>${text[i]}</color></size>`;
    }
    return rich;
}
