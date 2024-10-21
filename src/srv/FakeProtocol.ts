export interface StartResponse {
    reels: number;
    rows: number;
    startView: string[][];
}

export interface SpinResponse {
    view: string[][];
    ways: Way[];
}

type SlotSymbol = { name: string; value: number };
type Way = { symbol: string; positions: number[][]; prize: number };

export class FakeProtocol {
    private static readonly reels = 5;
    private static readonly rows = 3;
    public static symbolMap: SlotSymbol[] = generateSymbolMap();

    public static async fakeStartRequest(): Promise<StartResponse> {
        const startView = this.generateRandomView();
        const response: StartResponse = { reels: this.reels, rows: this.rows, startView };

        return new Promise<StartResponse>((resolve) => {
            setTimeout(() => resolve(response), this.randomResponseDelay());
        });
    }

    public static async fakeSpinRequest(): Promise<SpinResponse> {
        const view = this.generateRandomView();
        const ways = this.calculateWays(view);
        const response: SpinResponse = { view, ways };

        return new Promise<SpinResponse>((resolve) => {
            setTimeout(() => resolve(response), this.randomResponseDelay());
        });
    }

    private static generateRandomView(): string[][] {
        const view: string[][] = [];

        for (let i = 0; i < this.reels; i++) {
            const reel: string[] = [];

            for (let j = 0; j < this.rows; j++) {
                const randomSymbol = randomInt(this.symbolMap.length - 1);
                reel.push(this.symbolMap[randomSymbol].name);
            }

            view.push(reel);
        }

        return view;
    }

    private static calculateWays(view: string[][]): Way[] {
        const winningCombinations: Way[] = [];
        const uniqueSymbols = new Set<string>();

        view.forEach((reel) => reel.forEach((symbol) => uniqueSymbols.add(symbol)));
        uniqueSymbols.forEach((symbol) => {
            const result = calculateWaysForSymbol(symbol, view);
            if (result) {
                winningCombinations.push({
                    symbol,
                    positions: result.positions,
                    prize: result.prize * this.symbolMap.find((x) => x.name === symbol).value,
                });
            }
        });

        return winningCombinations;
    }

    private static randomResponseDelay = () => randomInt(150, 50);
}

function generateSymbolMap(): SlotSymbol[] {
    return [
        { name: "9", value: 10 },
        { name: "10", value: 10 },
        { name: "J", value: 20 },
        { name: "Q", value: 20 },
        { name: "K", value: 20 },
        { name: "A", value: 20 },
        { name: "M1", value: 50 },
        { name: "M2", value: 50 },
        { name: "M3", value: 70 },
        { name: "M4", value: 70 },
        { name: "M6", value: 70 },
        { name: "H1", value: 100 },
        { name: "H2", value: 200 },
        { name: "H3", value: 300 },
        { name: "H4", value: 400 },
        { name: "H5", value: 500 },
        { name: "H6", value: 600 },
    ];
}

function calculateWaysForSymbol(symbol: string, view: string[][]): { positions: number[][]; prize: number } | null {
    const minimumSymbols = 3;
    const reels = view.length;
    const rows = view[0].length;
    const allWays: number[][][] = [];

    function findWays(reel: number, currentWay: number[][]) {
        if (reel >= reels) {
            allWays.push(currentWay);
            return;
        }

        let foundSymbol = false;
        for (let row = 0; row < rows; row++) {
            if (view[reel][row] === symbol) {
                foundSymbol = true;
                findWays(reel + 1, [...currentWay, [reel, row]]);
            }
        }

        if (!foundSymbol && currentWay.length >= minimumSymbols) {
            allWays.push(currentWay);
        }
    }

    findWays(0, []);

    const validWays = allWays.filter((way) => way.length >= minimumSymbols);

    if (validWays.length > 0) {
        const uniquePositions = validWays.flat().filter((position, index, self) => {
            return (
                index ===
                self.findIndex((uniquePosition) => {
                    return position.toString() == uniquePosition.toString();
                })
            );
        });
        const prize = validWays.reduce((sum, way) => sum + way.length, 0);
        return { positions: uniquePositions, prize };
    }

    return null;
}

function randomInt(max: number = Number.MAX_VALUE, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
