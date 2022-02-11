import {GameDescriptor} from "./GameDescriptor";

export interface TileDescriptor extends GameDescriptor {
    objectType: "TileObject";

    x: number,
    y: number,
    len?: number,
    type: string,
    additionalType?: string,

    contains?: GameDescriptor
}