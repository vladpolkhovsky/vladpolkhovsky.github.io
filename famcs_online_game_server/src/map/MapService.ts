import {TileDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/TileDescriptor";
import * as fs from "fs"
import * as Buffer from "buffer";
import {TileType} from "../../../famcs_online_game_client/src/map/TileType";
import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {ChunkDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/ChunkDescriptor";

interface MapShort {
    map: string[][]
}

export class MapService {

    private static shortMapLocation: string = "./famcs_online_game_server/resources/map/map.short.js";

    private readonly tiles: TileDescriptor[][];

    private readonly chunks: ChunkDescriptor[];

    private shortMap: MapShort;

    private chunkSize: number = 10;

    private tileLength: number = 50;

    public constructor() {
        let buffer: Buffer = fs.readFileSync(MapService.shortMapLocation);
        this.shortMap = JSON.parse(buffer.toString());
        this.tiles = this.loadMapShort(this.shortMap.map);
        this.chunks = this.makeChunks(this.tiles);
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
                        j * this.tileLength,
                        i * this.tileLength,
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

    public getLocation(positionDescriptor: PositionDescriptor): ChunkDescriptor[] {
        return this.chunks;
    }

    private makeChunks(t: TileDescriptor[][]): ChunkDescriptor[] {
        let cd: Array<ChunkDescriptor> = new Array<ChunkDescriptor>();
        let cid: number = 1;
        let chunksCount: number = 0;
        for (let chunkX = 0; chunkX < t.length / this.chunkSize; chunkX++) {
            for (let chunkY = 0; chunkY < t[0].length / this.chunkSize; chunkY++) {
                let ccd = {
                    x: chunkX * this.chunkSize * this.tileLength,
                    y: chunkY * this.chunkSize * this.tileLength,
                    id: cid,
                    td: []
                } as ChunkDescriptor;
                cid++;
                for (let i = this.chunkSize * chunkX; i < Math.min(this.chunkSize * (chunkX + 1), t[0].length); i++) {
                    for (let j = this.chunkSize * chunkY; j < Math.min(this.chunkSize * (chunkY + 1), t.length); j++) {
                        ccd.td.push(t[j][i]);
                    }
                }
                cd.push(ccd);
                chunksCount += 1;
            }
        }
        console.log("Map loaded total chunks " + chunksCount);
        return cd;
    }
}