import { Container, Sprite, Texture } from "pixi.js";
import { TweenLite, Power2 } from "gsap";

export default class SpinButton extends Container {
    private readonly background: Sprite;
    private isEnabled: boolean;
    private overTween: TweenLite;
    private spinTween: TweenLite;
    private pressResolve?: (value: void | PromiseLike<void>) => void;

    constructor() {
        super();

        this.background = new Sprite(Texture.from("spin_out.png"));
        this.background.anchor.set(0.5, 0.5);
        this.addChild(this.background);

        this.background.eventMode = "static";
        this.background.on("pointerover", this.onPointerOver.bind(this));
        this.background.on("pointerout", this.onPointerOut.bind(this));
        this.background.on("pointerdown", this.onPointerDown.bind(this));

        this.isEnabled = true;
    }

    // Return a promise that resolves when the button is pressed
    public waitForPress(): Promise<void> {
        return new Promise((resolve) => {
            this.pressResolve = resolve;
        });
    }

    public setEnabled(value: boolean): void {
        this.isEnabled = value;
        this.background.texture = Texture.from(value ? "spin_out.png" : "spin_disabled.png");
    }

    private onPointerOver() {
        if (!this.isEnabled) return;

        this.overTween?.kill();
        this.overTween = new TweenLite(this.background.scale, 0.25, { x: 1.05, y: 1.05 });
    }
    private onPointerOut() {
        this.overTween?.kill();
        this.overTween = new TweenLite(this.background.scale, 0.25, { x: 1, y: 1 });
    }
    private onPointerDown() {
        if (!this.isEnabled) return;

        this.spinTween?.kill();
        this.spinTween = new TweenLite(this.background, 0.4, { rotation: Math.PI, ease: Power2.easeIn });
        this.spinTween.eventCallback("onComplete", () => (this.background.rotation = 0));
        this.setEnabled(false);

        this.pressResolve?.();
        this.pressResolve = null;
    }
}
