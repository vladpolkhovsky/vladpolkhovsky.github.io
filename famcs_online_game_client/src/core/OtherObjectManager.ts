import {Container, Sprite} from "pixi.js";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";
import {GameDescriptor} from "../map/discriptors/GameDescriptor";
import {BulletDescriptor} from "../map/discriptors/BulletDescriptor";

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

    public constructor() {
        this.container.zIndex = 90;
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
}