export const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        let randomNumber = Math.floor(Math.random() * 16);
        color += letters[randomNumber];
    }
    return color;
}