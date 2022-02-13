import { TileDescriptor } from "../../../famcs_online_game_client/src/map/discriptors/TileDescriptor";
import * as fs from "fs"
import * as Buffer from "buffer";
import { TileType } from "../../../famcs_online_game_client/src/map/TileType";

interface MapShort {
    map: string[][]
}

export class MapService {

    private static shortMapLocation: string = "./famcs_online_game_server/resources/map/map.short.js";

    private tiles:TileDescriptor[][];

    private shortMap:MapShort;

    public constructor() {
        let buffer:Buffer = fs.readFileSync(MapService.shortMapLocation);
        this.shortMap = JSON.parse(buffer.toString());
        this.tiles = this.loadMapShort(this.shortMap.map)
        console.log("Map loaded from " + MapService.shortMapLocation + ', result tile count ' + this.tiles.length * this.tiles[0].length);
    }

    public getTilesDescriptors(): TileDescriptor[][] {
        return this.tiles;
    }

    public loadMapShort(map: string[][]): TileDescriptor[][] {
        let tdMap: TileDescriptor[][] = new Array<TileDescriptor[]>();
        for (let i = 0; i < map.length; i++) {
            tdMap.push([]);
            for (let j = 0; j < map[i].length; j++) {
                tdMap[i].push(this.parseItem(
                        j * 50,
                        i * 50,
                        map[i][j]
                    )
                );
            }
        }
        return tdMap;
    }

    public parseItem(x: number, y: number, tile: string): TileDescriptor {
        let type: string;

        if (tile === "G") {
            type = TileType[TileType.Grass];
        }

        if (tile === "R") {
            type = TileType[TileType.Road];
        }
        return {
            x: x,
            y: y,
            type: type
        } as TileDescriptor;
    }

}