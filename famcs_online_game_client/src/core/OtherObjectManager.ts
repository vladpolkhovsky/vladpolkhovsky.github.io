import {Container, Sprite} from "pixi.js";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";

interface OtherPlayerObject {

    pd: PlayerDescriptor,

    sprite: Sprite

}

export class OtherObjectManager {

    private container: Container = new Container();

    private idToPlayerObject: Map<number, OtherPlayerObject> = new Map<number, OtherPlayerObject>()

    public constructor() {
        this.container.zIndex = 90;
    }

    public apply(pDescriptor: PlayerDescriptor) {
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

    public attach(container: Container) {
        container.addChild(this.container);
    }

    public remove(id:number): void {
        this.container.removeChild(this.idToPlayerObject.get(id).sprite);
    }
}