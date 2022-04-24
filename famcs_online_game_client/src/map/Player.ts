import {PlayerDescriptor} from "./discriptors/PlayerDescriptor";
import {Container, Sprite} from "pixi.js";

export class Player {

    private sprite_common: Sprite = Sprite.from("../resources/player-self.png");

    private sprite_target: Sprite = Sprite.from("../resources/player-self-target.png");

    private sprite: Sprite;

    private descriptor: PlayerDescriptor;

    private constructor() {
        this.sprite_common.anchor.set(0.5);
        this.sprite_target.anchor.set(0.5);
        this.sprite_common.visible = false;
        this.sprite_target.visible = false;
    }

    public load(pd: PlayerDescriptor) {
        if (pd.type === "common") {
            this.sprite = this.sprite_common;
        } else {
            this.sprite = this.sprite_target;
        }
        this.sprite.visible = true;
        this.descriptor = pd;
        this.applyDescriptor(pd);
        return this;
    }

    public applyDescriptor(pd: PlayerDescriptor) {
        if (this.descriptor.type !== pd.type) {
            this.sprite.visible = false;
            if (pd.type === "common") {
                this.sprite = this.sprite_common;
            } else {
                this.sprite = this.sprite_target;
            }
        }
        this.sprite.visible = true;
        this.sprite.position.set(pd.x, pd.y)
        this.descriptor = pd;
    }

    public attach(container: Container) {
        this.sprite_common.zIndex = 100;
        this.sprite_target.zIndex = 100;
        container.addChild(this.sprite_common, this.sprite_target);
    }

    public static builder(): Player {
        return new Player();
    }

    public getDescriptor() {
        return this.descriptor;
    }
}