import {GameDescriptor} from "./GameDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface BulletDescriptor extends GameDescriptor, PositionDescriptor {
    objectType: "bullet",
    direction: number,
    ownerId?: number
    id?: number,
}