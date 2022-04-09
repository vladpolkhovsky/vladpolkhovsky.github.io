import {Tile} from "../Tile";
import {TileDescriptor} from "../discriptors/TileDescriptor";
import {TileType} from "../TileType";

export class TileBuilder {

    public static DEFAULT_TILE_LEN = 50;

    private constructor() {

    }

    public static buildTile(descriptor: TileDescriptor): Tile {
        let len = descriptor.len === undefined ? this.DEFAULT_TILE_LEN : descriptor.len;
        let type = TileType[descriptor.type];
        let color: number = undefined;

        if (type === TileType.Road) {
            color = 0x888888;
        }

        if (type === TileType.Grass) {
            color = 0x339933;
        }

        return new Tile(descriptor.x, descriptor.y, len, descriptor.chunkId, color);
    }

}