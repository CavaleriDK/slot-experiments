import { default as StateMachine } from "state-machine-flow";
import { Application, DisplayObject } from "pixi.js";
import BaseState from "./states/BaseState";
import { Setup } from "./states/Setup";
import { Init } from "./states/Init";
import { Idle } from "./states/Idle";
import { Spinning } from "./states/Spinning";
import { WinFlow } from "./states/WinFlow";

type Transition = { from: string; to: string };
type EventConfig = { [key: string]: Transition[] };
type IStates = { [key: string]: BaseState };
type Way = { symbol: string; positions: number[][]; prize: number };

export interface GameConfiguration {
    reels: number;
    rows: number;
}

export interface SpinState {
    view: string[][];
    ways: Way[];
}

export default class Game {
    public app: Application;
    public static GAME_WIDTH = 1200;
    public static GAME_HEIGHT = 800;
    public static SYMBOL_SIZE = 200;

    public eventConfig: EventConfig;
    public stateMachine: StateMachine;
    public displayObjects: { [key: string]: DisplayObject } = {};
    public lastRoundState: SpinState = null;
    public configuration: GameConfiguration;
    public states: IStates = {};

    constructor(app?: Application) {
        this.app = app;
        this.eventConfig = this.createTransitionsConfig();
    }

    public initialize(initialState: string): void {
        this.stateMachine = new StateMachine(initialState, this.eventConfig);
        this.states = this.initializeStates();
    }

    private createTransitionsConfig = (): EventConfig => {
        return {
            ready: [{ from: "setup", to: "init" }],
            initialized: [{ from: "init", to: "idle" }],
            startSpinning: [{ from: "idle", to: "spinning" }],

            noWinRoundComplete: [{ from: "spinning", to: "idle" }],

            evaluateWinnings: [{ from: "spinning", to: "winFlow" }],
            winRoundComplete: [{ from: "winFlow", to: "idle" }],
        };
    };
    private initializeStates = (): IStates => {
        return {
            setup: new Setup(this),
            init: new Init(this),
            idle: new Idle(this),
            spinning: new Spinning(this),
            winFlow: new WinFlow(this),
        };
    };
}
