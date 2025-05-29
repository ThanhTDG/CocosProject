const { getRainbowRichText, RAINBOW_SIZES } = require("../utils/richTextUtils");

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
        textLoading: {
            default: "Loading...",
            tooltip: "Text to display during loading",
        },
        minTimeLoading: {
            default: 1000,
            tooltip: "Minimum time to show loading screen in milliseconds",
        }
    },
    statics: {
        targetScene: "lobby",
        loadWithLoading(sceneName = "lobby") {
            this.targetScene = sceneName;
            cc.director.loadScene("loading");
        }
    },
    start() {
        this.onLoadingScreen();
    },

    onLoadingScreen() {
        const sceneName = this.constructor.targetScene;
        const minTimeLoadingMs = this.minTimeLoading;
        const startTime = Date.now();
        this.colorIndex = 0;
        this.loadingText = this.textLoading;
        this.sizes = RAINBOW_SIZES;

        this.schedule(this.updateLoadingRichText, 0.1);

        cc.director.preloadScene(
            sceneName,
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
                        cc.director.loadScene(sceneName);
                    }, wait);
                } else {
                    cc.error("Preload scene error:", error);
                }
            }
        );
    },
    updateLoadingRichText() {
        const text = `${this.loadingText} ${this.percent || 0}%;`
        if (this.richText) {
            this.richText.string = getRainbowRichText(
                text,
                this.colorIndex,
                this.sizes,
            );
        }
        this.colorIndex = (this.colorIndex + 1) % this.sizes.length;
    },


})