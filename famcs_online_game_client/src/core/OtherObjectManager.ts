import {Container, Graphics, Sprite, utils} from "pixi.js";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";
import {BoxDescriptor} from "../map/discriptors/BoxDescriptor";
import {BorderDescriptor} from "../map/discriptors/BorderDescriptor";

interface OtherPlayerObject {

    pd: PlayerDescriptor,

    sprite: Sprite,

    sprite_common: Sprite,

    sprite_target: Sprite

}

interface BoxObject {

    bd: BoxDescriptor,

    sprite: Sprite

}

export class OtherObjectManager {

    private container: Container = new Container();

    private idToPlayerObject: Map<number, OtherPlayerObject> = new Map<number, OtherPlayerObject>();

    private idToBulletObject: Map<number, BoxObject> = new Map<number, BoxObject>();

    private border: Graphics = new Graphics();

    public constructor() {
        this.container.zIndex = 90;
        this.container.addChild(this.border);
    }

    public applyPlayer(pDescriptor: PlayerDescriptor) {
        let otherPlayerObject: OtherPlayerObject = this.idToPlayerObject.get(pDescriptor.id);

        if (otherPlayerObject === undefined) {
            let sprite_common = Sprite.from("../resources/player.png");
            let sprite_target = Sprite.from("../resources/player-target.png");
            let sprite;

            if (pDescriptor.type === "common") {
                sprite = sprite_common;
            } else {
                sprite = sprite_target;
            }

            sprite_common.visible = false;
            sprite_target.visible = false;

            sprite_target.anchor.set(0.5);
            sprite_common.anchor.set(0.5);

            otherPlayerObject = {
                pd: pDescriptor,
                sprite_common: sprite_common,
                sprite_target: sprite_target,
                sprite: sprite
            } as OtherPlayerObject;

            otherPlayerObject.sprite.visible = true;
            otherPlayerObject.sprite.position.set(otherPlayerObject.pd.x, otherPlayerObject.pd.y);

            this.idToPlayerObject.set(pDescriptor.id, otherPlayerObject);
            this.container.addChild(sprite_common, sprite_target);
        }

        if (otherPlayerObject.pd.type !== pDescriptor.type) {
            otherPlayerObject.sprite.visible = false;
            if (pDescriptor.type === "common") {
                otherPlayerObject.sprite = otherPlayerObject.sprite_common;
            } else {
                otherPlayerObject.sprite = otherPlayerObject.sprite_target;
            }
            otherPlayerObject.sprite.visible = true;
        }

        otherPlayerObject.pd = pDescriptor;
        otherPlayerObject.sprite.position.set(otherPlayerObject.pd.x, otherPlayerObject.pd.y);
    }

    public applyBox(bDescriptor: BoxDescriptor) {
        let boxObject: BoxObject = this.idToBulletObject.get(bDescriptor.id);
        if (boxObject === undefined) {
            let sprite: Sprite = Sprite.from("../resources/box.png");
            sprite.anchor.set(0.5);
            boxObject = {
                bd: bDescriptor,
                sprite: sprite
            } as BoxObject;
            boxObject.sprite.position.set(boxObject.bd.x, boxObject.bd.y);
            this.idToBulletObject.set(bDescriptor.id, boxObject);
            this.container.addChild(sprite);
        }
    }

    public attach(container: Container) {
        container.addChild(this.container);
    }

    public remove(id:number): void {
        let idToPlayerObject = this.idToPlayerObject.get(id);
        if (idToPlayerObject !== undefined) {
            this.container.removeChild(idToPlayerObject.sprite);
        }
        let idToBoxObject = this.idToBulletObject.get(id);
        if (idToBoxObject !== undefined) {
            this.container.removeChild(idToBoxObject.sprite);
        }
    }

    private t = 0;

    public applyBorder(bDescriptor: BorderDescriptor) {
        this.t += 0.01;
        let b = Math.sin(this.t) * 0.3;
        this.border.clear();
        this.border.lineStyle(10, utils.rgb2hex([1, b + 0.7, -b + 0.7]));
        this.border.drawCircle(bDescriptor.x, bDescriptor.y, bDescriptor.r);
        this.border.endFill();
    }
}