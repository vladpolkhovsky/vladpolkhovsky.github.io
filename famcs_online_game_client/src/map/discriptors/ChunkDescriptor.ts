import {GameDescriptor} from "./GameDescriptor";
import {TileDescriptor} from "./TileDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface ChunkDescriptor extends GameDescriptor, PositionDescriptor {
    id: number,
    td: TileDescriptor[],
    objectType: "chunk",
}