import {Container, Graphics, Sprite, utils} from "pixi.js";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";
import {BulletDescriptor} from "../map/discriptors/BulletDescriptor";
import {BorderDescriptor} from "../map/discriptors/BorderDescriptor";

interface OtherPlayerObject {

    pd: PlayerDescriptor,

    sprite: Sprite

}

interface BulletObject {

    bd: BulletDescriptor,

    sprite: Sprite

}

export class OtherObjectManager {

    private container: Container = new Container();

    private idToPlayerObject: Map<number, OtherPlayerObject> = new Map<number, OtherPlayerObject>();

    private idToBulletObject: Map<number, BulletObject> = new Map<number, BulletObject>();

    private border: Graphics = new Graphics();

    public constructor() {
        this.container.zIndex = 90;
        this.container.addChild(this.border);
    }

    public applyPlayer(pDescriptor: PlayerDescriptor) {
        let otherPlayerObject: OtherPlayerObject = this.idToPlayerObject.get(pDescriptor.id);
        if (otherPlayerObject === undefined) {
            let sprite: Sprite = Sprite.from("../resources/player.png");
            sprite.anchor.set(0.5);
            otherPlayerObject = {
                pd: pDescriptor,
                sprite: sprite
            } as OtherPlayerObject;
            otherPlayerObject.sprite.position.set(otherPlayerObject.pd.x, otherPlayerObject.pd.y);
            this.idToPlayerObject.set(pDescriptor.id, otherPlayerObject);
            this.container.addChild(sprite);
        }
        otherPlayerObject.pd = pDescriptor;
        otherPlayerObject.sprite.position.set(otherPlayerObject.pd.x, otherPlayerObject.pd.y);
    }

    public applyBullet(bDescriptor: BulletDescriptor) {
        let bulletObject: BulletObject = this.idToBulletObject.get(bDescriptor.id);
        if (bulletObject === undefined) {
            // TODO Исправить на спрайт пули.
            let sprite: Sprite = Sprite.from("../resources/player.png");
            sprite.anchor.set(0.5);
            bulletObject = {
                bd: bDescriptor,
                sprite: sprite
            } as BulletObject;
            bulletObject.sprite.position.set(bulletObject.bd.x, bulletObject.bd.y);
            this.idToBulletObject.set(bDescriptor.id, bulletObject);
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
        let idToBulletObject = this.idToBulletObject.get(id);
        if (idToBulletObject !== undefined) {
            this.container.removeChild(idToBulletObject.sprite);
        }
    }

    private t = 0;

    public applyBorder(bDescriptor: BorderDescriptor) {
        this.t += 0.01;
        let b = Math.sin(this.t) * 0.3;
        console.log(b);
        this.border.clear();
        this.border.lineStyle(10, utils.rgb2hex([1, b + 0.7, -b + 0.7]));
        this.border.drawCircle(bDescriptor.x, bDescriptor.y, bDescriptor.r);
        this.border.endFill();
    }
}