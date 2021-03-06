import {GameDescriptor} from "./GameDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface PlayerDescriptor extends GameDescriptor, PositionDescriptor {
    objectType: "player",
    direction: number,
    type?: string,
    id?: number
}