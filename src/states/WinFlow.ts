import BaseState from "./BaseState";
import Game from "../Game";
import { SymbolsContainer } from "../entities/SymbolsContainer";
import { Text, TextStyle } from "pixi.js";

export class WinFlow extends BaseState {
    constructor(game: Game) {
        super(game, "winFlow");
    }

    protected async enter(): Promise<void> {
        this.toggleWinLines(true);

        const winText = new Text(
            "",
            new TextStyle({
                dropShadow: true,
                dropShadowBlur: 20,
                dropShadowColor: "#d9de63",
                dropShadowDistance: 0,
                fill: "#ffffff",
                fontSize: 140,
                fontWeight: "bold",
                stroke: "#d9de63",
                strokeThickness: 8,
            }),
        );
        winText.anchor.set(0.5, 0.5);
        winText.position.set(Game.GAME_WIDTH / 2, Game.GAME_HEIGHT / 2 - 60);
        this.game.app.stage.addChild(winText);

        await this.animateTickUp(
            this.game.lastRoundState.ways.reduce((sum, way) => way.prize, 0),
            winText,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.toggleWinLines(false);
        this.game.app.stage.removeChild(winText);

        this.next();
    }

    private toggleWinLines(show: boolean): void {
        const symbolsContainer = this.game.displayObjects.symbolsContainer as SymbolsContainer;
        for (const way of this.game.lastRoundState.ways) {
            for (const position of way.positions) {
                symbolsContainer.toggleWinSymbol(position[0], position[1], show);
            }
        }
    }

    private animateTickUp = async (targetValue: number, pixiText: Text): Promise<void> => {
        return new Promise<void>(async (tickUpComplete) => {
            const inc = targetValue / 100;
            let value = 0;
            while (value < targetValue) {
                value = Math.min(value + inc, targetValue);
                pixiText.text = ` ${value.toFixed(2)} `;
                await new Promise((resolve) => setTimeout(resolve, 10));
            }

            tickUpComplete();
        });
    };
}
