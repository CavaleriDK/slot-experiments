import "./style.css";
import { Application } from "pixi.js";
import Game from "./Game";

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xd3d3d3,
    width: Game.GAME_WIDTH,
    height: Game.GAME_HEIGHT,
});
globalThis.__PIXI_APP__ = app;
const container = document.createElement("div");

window.onload = async (): Promise<void> => {
    globalThis.game = new Game(app);
    globalThis.game.initialize("setup");

    container.appendChild(app.view);
    document.body.appendChild(container);

    window.addEventListener("resize", handleResize);
    handleResize();
};

function handleResize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = Game.GAME_WIDTH / Game.GAME_HEIGHT;
    let newWidth: number, newHeight: number;

    if (windowWidth / windowHeight >= aspectRatio) {
        newHeight = windowHeight;
        newWidth = windowHeight * aspectRatio;
    } else {
        newWidth = windowWidth;
        newHeight = windowWidth / aspectRatio;
    }

    app.renderer.resize(newWidth, newHeight);

    const scaleX = newWidth / Game.GAME_WIDTH;
    const scaleY = newHeight / Game.GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    app.stage.scale.set(scale, scale);
    app.stage.x = (newWidth - Game.GAME_WIDTH * scale) / 2;
    app.stage.y = (newHeight - Game.GAME_HEIGHT * scale) / 2;
}
