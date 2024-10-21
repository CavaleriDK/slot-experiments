import StateMachine from "state-machine-flow";
import Game from "../Game";

export default class BaseState {
    protected readonly game: Game;
    protected readonly stateMachine: StateMachine;
    protected readonly transitions: string[]; // List of valid transitions
    protected nextTransition: string;

    protected readonly name: string;

    constructor(game: Game, name: string) {
        this.game = game;
        this.name = name;
        this.stateMachine = game.stateMachine;
        this.transitions = this.getTransitionsForState();
        this.nextTransition = this.transitions[0] || ""; // Initialize with the first transition or an empty string
        console.log("[FSM] " + this.name, this.transitions);

        this.stateMachine.onEnter(this.name, this.enter.bind(this));
        this.stateMachine.onLeave(this.name, this.leave.bind(this));
        this.stateMachine.onError((err) => {
            console.error("StateMachine Error:", err);
        });
    }

    private getTransitionsForState = (): string[] => {
        return Object.keys(this.game.eventConfig).filter((event) =>
            this.game.eventConfig[event].some((transition) => transition.from === this.name),
        );
    };

    protected enter() {
        //console.log(`Entering state: ${this.name}`);
    }

    protected next() {
        if (this.nextTransition && this.transitions.includes(this.nextTransition)) {
            console.log(
                `[FSM] ${this.name} -> ${this.game.eventConfig[this.nextTransition][0].to} (${this.nextTransition})`,
            );
            this.stateMachine.trigger(this.nextTransition);
        } else {
            console.error(`Invalid transition: ${this.nextTransition} from state: ${this.name}`);
        }
    }

    protected leave() {
        //console.log(`Leaving state: ${this.name}`);
    }
    /*
    get currentState() {
        return this.stateMachine.getCurrentState();
    }
 */
}
