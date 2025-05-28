cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "Progress bar for loading",
        },
        richText: {
            default: null,
            type: cc.RichText,
            tooltip: "Label to display loading text",
        },
        minTimeLoading: {
            default: 1000,
            tooltip: "Time to wait before starting the loading screen",
        }
    },
    data() {
        return {
            colorIndex: 0,
            loadingColors: [
                "#ff0000", // đỏ
                "#ffa500", // cam
                "#ffff00", // vàng
                "#00ff00", // xanh lá
                "#00ffff", // xanh ngọc
                "#0000ff", // xanh dương
                "#800080", // tím
            ],
            loadingText: "Loading...",
        };
    },
    onLoadingScreen() {
        const minTimeLoadingMs = this.minTimeLoading;
        const startTime = Date.now();

        this.colorIndex = 0;
        this.loadingColors = [
            "#ff0000", "#ffa500", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#800080", "#ff69b4", "#ffffff"
        ];
        this.loadingText = "Loading...";

        this.schedule(this.updateLoadingRichText, 0.1); // cập nhật mỗi 0.1s

        cc.director.preloadScene(
            "lobby",
            (completedCount, totalCount, item) => {
                if (this.loadingBar) {
                    this.loadingBar.progress = completedCount / totalCount;
                }
                this.percent = Math.min(99, Math.floor((completedCount / totalCount) * 100));
            },
            (error, asset) => {
                if (!error) {
                    const elapsed = Date.now() - startTime;
                    const wait = Math.max(0, minTimeLoadingMs - elapsed);
                    setTimeout(() => {
                        this.unschedule(this.updateLoadingRichText);
                        cc.director.loadScene("lobby");
                    }, wait);
                } else {
                    cc.error("Preload scene error:", error);
                }
            }
        );
    },
    updateLoadingRichText() {
        const sizes = [50, 30, 30, 30, 30, 30, 30, 30, 30, 30];
        let rich = "";
        for (let i = 0; i < this.loadingText.length; i++) {
            const size = sizes[(i + this.colorIndex) % this.loadingText.length];
            const color = this.loadingColors[(i + this.colorIndex) % this.loadingColors.length];
            rich += `<size=${size}><color=${color}>${this.loadingText[i]}</color></size>`;
        }
        if (this.richText) {
            this.richText.string = `${rich} <size=40><color=#ffff00>${this.percent || 0}%</color></size>`;
        }
        this.colorIndex = (this.colorIndex + 1) % this.loadingText.length;
    },


    start() {
        this.onLoadingScreen();
    },

    // onLoadingScreen() {
    //     const minTimeLoadingMs = this.minTimeLoading;
    //     const startTime = Date.now();

    //     cc.director.preloadScene(
    //         "lobby",
    //         (completedCount, totalCount, item) => {
    //             if (this.loadingBar) {
    //                 this.loadingBar.progress = completedCount / totalCount;
    //             }
    //             if (this.richText) {
    //                 this.richText.string = `Loading... ${Math.min(99, Math.floor((completedCount / totalCount) * 100))}%`;
    //             }
    //         },
    //         (error, asset) => {
    //             if (!error) {
    //                 const elapsed = Date.now() - startTime;
    //                 const wait = Math.max(0, minTimeLoadingMs - elapsed);
    //                 setTimeout(() => {
    //                     cc.director.loadScene("lobby");
    //                 }, wait);
    //             } else {
    //                 cc.error("Preload scene error:", error);
    //             }
    //         }
    //     );
    // },
})