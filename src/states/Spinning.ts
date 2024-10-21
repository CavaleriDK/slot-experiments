import BaseState from "./BaseState";
import Game from "../Game";
import { FakeProtocol } from "../srv/FakeProtocol";
import { SymbolsContainer } from "../entities/SymbolsContainer";

export class Spinning extends BaseState {
    constructor(game: Game) {
        super(game, "spinning");
    }

    protected async enter(): Promise<void> {
        const symbolsContainer = this.game.displayObjects.symbolsContainer as SymbolsContainer;
        const parallelOutputs = await Promise.all([FakeProtocol.fakeSpinRequest(), symbolsContainer.dropSymbolsOut()]);

        const spinResponse = parallelOutputs[0];
        this.game.lastRoundState = spinResponse;

        symbolsContainer.syncSymbolsWithView(spinResponse.view);
        await symbolsContainer.dropSymbolsIn();

        this.nextTransition = spinResponse.ways.length > 0 ? "evaluateWinnings" : "noWinRoundComplete";

        this.next();
    }
}
