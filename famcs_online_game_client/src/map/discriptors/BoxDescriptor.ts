import {GameDescriptor} from "./GameDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface BoxDescriptor extends GameDescriptor, PositionDescriptor {
    objectType: "box",
    id?: number,
}