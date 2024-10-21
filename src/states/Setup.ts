import BaseState from "./BaseState";
import Game from "../Game";
import { Assets } from "pixi.js";

export class Setup extends BaseState {
    constructor(game: Game) {
        super(game, "setup");

        this.enter();
    }

    protected async enter() {
        super.enter();

        await this.loadGameAssets();
        this.next();
    }

    private loadGameAssets = async (): Promise<void> => {
        const manifest = {
            bundles: [
                {
                    name: "symbols",
                    assets: [
                        {
                            name: "symbols",
                            srcs: "./assets/symbols.json",
                        },
                    ],
                },
                {
                    name: "controls",
                    assets: [
                        {
                            name: "controls",
                            srcs: "./assets/controls.json",
                        },
                    ],
                },
            ],
        };

        await Assets.init({ manifest });
        await Assets.loadBundle(["symbols", "controls"]);
    };
}
