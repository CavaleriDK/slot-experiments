import { AnimatedSprite, Container, Texture } from "pixi.js";
import Game, { GameConfiguration } from "../Game";
import { Power2, Power3, TimelineLite } from "gsap";

export class SymbolsContainer extends Container {
    private gameConfiguration: GameConfiguration;
    private symbols: AnimatedSprite[][] = [];

    constructor(gameConfiguration: GameConfiguration, startView: string[][]) {
        super();

        this.gameConfiguration = gameConfiguration;
        this.createChildren();
        this.syncSymbolsWithView(startView);
    }

    public async dropSymbolsOut(): Promise<void> {
        const spinOutDuration = 0.4;
        const reelDelayFactor = 0.05;
        const symbolDelayFactor = 0.03;
        const timeline = new TimelineLite();

        for (let reel = 0; reel < this.gameConfiguration.reels; reel++) {
            for (let row = 0; row < this.gameConfiguration.rows; row++) {
                const symbol = this.symbols[reel][row];
                const delay = reelDelayFactor * reel + symbolDelayFactor * (this.gameConfiguration.rows - row);

                timeline.to(symbol, spinOutDuration, { y: symbol.y + Game.GAME_HEIGHT, ease: Power2.easeIn }, delay);
            }
        }

        await new Promise((resolve) => {
            timeline.eventCallback("onComplete", resolve);
        });
    }

    public async dropSymbolsIn(): Promise<void> {
        const spinInDuration = 0.4;
        const reelDelayFactor = 0.05;
        const symbolDelayFactor = 0.03;
        const relativeStartPositionY = -((this.gameConfiguration.rows / 2) * Game.SYMBOL_SIZE - Game.SYMBOL_SIZE * 0.5);
        const timeline = new TimelineLite();

        for (let reel = 0; reel < this.gameConfiguration.reels; reel++) {
            for (let row = 0; row < this.gameConfiguration.rows; row++) {
                const symbol = this.symbols[reel][row];
                const delay = reelDelayFactor * reel + symbolDelayFactor * (this.gameConfiguration.rows - row);
                const bounceDuration = spinInDuration * 0.15;
                const bounceAmount = 10;

                symbol.y = relativeStartPositionY + row * Game.SYMBOL_SIZE - Game.GAME_HEIGHT;
                timeline.to(
                    symbol,
                    spinInDuration - bounceDuration,
                    { y: symbol.y + Game.GAME_HEIGHT, ease: Power3.easeIn },
                    delay,
                );
                timeline.to(
                    symbol,
                    bounceDuration / 2,
                    { y: symbol.y + Game.GAME_HEIGHT - bounceAmount, ease: Power3.easeOut },
                    delay + spinInDuration - bounceDuration,
                );
                timeline.to(
                    symbol,
                    bounceDuration / 2,
                    { y: symbol.y + Game.GAME_HEIGHT, ease: Power3.easeIn },
                    delay + spinInDuration - bounceDuration / 2,
                );
            }
        }

        await new Promise((resolve) => {
            timeline.eventCallback("onComplete", resolve);
        });
    }

    public syncSymbolsWithView(view: string[][]) {
        for (let reel = 0; reel < view.length; reel++) {
            for (let row = 0; row < view[reel].length; row++) {
                this.changeSymbolInView(reel, row, view[reel][row]);
            }
        }
    }

    public toggleWinSymbol(reel: number, row: number, winning: boolean): void {
        if (winning) {
            this.symbols[reel][row].play();
        } else {
            this.symbols[reel][row].stop();
            this.symbols[reel][row].currentFrame = 0;
        }
    }

    private changeSymbolInView(reel: number, row: number, symbolName: string) {
        this.symbols[reel][row].textures = [
            Texture.from(`${symbolName}.png`),
            Texture.from(`${symbolName}_connect.png`),
        ];
    }

    private createChildren() {
        const relativeStartPosition = {
            x: -((this.gameConfiguration.reels / 2) * Game.SYMBOL_SIZE - Game.SYMBOL_SIZE * 0.5),
            y: -((this.gameConfiguration.rows / 2) * Game.SYMBOL_SIZE - Game.SYMBOL_SIZE * 0.5),
        };
        for (let reel = 0; reel < this.gameConfiguration.reels; reel++) {
            this.symbols.push([]);
            for (let row = 0; row < this.gameConfiguration.rows; row++) {
                const symbol = new AnimatedSprite([Texture.EMPTY]);
                symbol.position.set(
                    relativeStartPosition.x + reel * Game.SYMBOL_SIZE,
                    relativeStartPosition.y + row * Game.SYMBOL_SIZE,
                );
                symbol.anchor.set(0.5, 0.5);
                symbol.animationSpeed = 0.1;
                symbol.loop = true;
                this.symbols[reel][row] = symbol;
                this.addChild(symbol);
            }
        }
    }
}
