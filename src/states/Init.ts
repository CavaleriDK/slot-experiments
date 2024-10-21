import BaseState from "./BaseState";
import Game from "../Game";
import { SymbolsContainer } from "../entities/SymbolsContainer";
import { FakeProtocol, StartResponse } from "../srv/FakeProtocol";
import SpinButton from "../entities/SpinButton";

export class Init extends BaseState {
    constructor(game: Game) {
        super(game, "init");
    }

    protected async enter() {
        super.enter();

        const startResponse: StartResponse = await FakeProtocol.fakeStartRequest();
        this.game.configuration = { ...startResponse };

        const reelsContainer = (this.game.displayObjects.symbolsContainer = new SymbolsContainer(
            this.game.configuration,
            startResponse.startView,
        ));
        reelsContainer.position.set(Game.GAME_WIDTH / 2, Game.GAME_HEIGHT / 2 - 70);
        this.game.app.stage.addChild(reelsContainer);

        const spinButton = (this.game.displayObjects.spinButton = new SpinButton());
        spinButton.position.set(Game.GAME_WIDTH / 2, Game.GAME_HEIGHT - 40);
        this.game.app.stage.addChild(spinButton);

        this.next();
    }
}
