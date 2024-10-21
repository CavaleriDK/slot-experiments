import Game from "../src/Game";
import { FakeProtocol } from "../src/srv/FakeProtocol";

describe("Game Functionality", () => {
    test("All client state transitions exist", () => {
        const game = new Game();

        expect(Object.keys(game.eventConfig)).toEqual(
            expect.arrayContaining([
                "ready",
                "initialized",
                "startSpinning",
                "noWinRoundComplete",
                "evaluateWinnings",
                "winRoundComplete",
            ]),
        );
    });

    test("Fake server has 5 reels and 3 rows", async () => {
        const startResponse = await FakeProtocol.fakeStartRequest();

        expect(startResponse.reels).toEqual(5);
        expect(startResponse.rows).toEqual(3);
    });

    test("Fake server produces random spin results", async () => {
        const firstSpin = await FakeProtocol.fakeSpinRequest();
        const secondSpin = await FakeProtocol.fakeSpinRequest();

        // Although there is a likelyhood we get the same spin results in both spins,
        // for the sake of demonstration lets still compare. In reality, we would want to
        // compare against real server responses, using a cheat engine that can force specific results.
        expect(firstSpin.view).not.toEqual(secondSpin.view);
    });
});
