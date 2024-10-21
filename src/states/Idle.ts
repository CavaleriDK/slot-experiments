import BaseState from "./BaseState";
import Game from "../Game";
import SpinButton from "../entities/SpinButton";

export class Idle extends BaseState {
    constructor(game: Game) {
        super(game, "idle");
    }

    protected async enter(): Promise<void> {
        const spinButton = this.game.displayObjects.spinButton as SpinButton;

        spinButton.setEnabled(true);
        await spinButton.waitForPress();

        this.next();
    }
}
