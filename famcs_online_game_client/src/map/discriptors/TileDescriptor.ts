import {GameDescriptor} from "./GameDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface TileDescriptor extends GameDescriptor, PositionDescriptor {
    objectType: "TileObject";

    len?: number,
    type: string,
    additionalType?: string,

    contains?: GameDescriptor
}