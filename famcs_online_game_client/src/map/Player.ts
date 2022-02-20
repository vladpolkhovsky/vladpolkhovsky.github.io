import {PlayerDescriptor} from "./discriptors/PlayerDescriptor";
import {Container, Sprite} from "pixi.js";

export class Player {

    private sprite: Sprite = Sprite.from("../resources/player.png");

    private descriptor: PlayerDescriptor;

    private constructor() {
        this.sprite.anchor.set(0.5);
    }

    public load(pd: PlayerDescriptor) {
        this.descriptor = pd;
        return this;
    }

    public applyDescriptor(pd: PlayerDescriptor) {
        this.descriptor = pd;
        this.sprite.position.set(pd.x, pd.y)
    }

    public attach(container: Container) {
        container.addChild(this.sprite);
    }

    public static builder(): Player {
        return new Player();
    }

    public getDescriptor() {
        return this.descriptor;
    }
}