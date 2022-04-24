import {TileDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/TileDescriptor";
import * as fs from "fs"
import * as Buffer from "buffer";
import {TileType} from "../../../famcs_online_game_client/src/map/TileType";
import {ChunkDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/ChunkDescriptor";
import {UpdateChunksMessage} from "../../../famcs_online_game_client/src/core/network/UpdateChunksMessage";
import {PlayerDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PlayerDescriptor";
import {BorderDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/BorderDescriptor";

interface MapShort {
    map: string[][]
}

export class MapService {

    private static shortMapLocation: string = "./famcs_online_game_server/resources/map/map.short.js";

    private readonly tiles: TileDescriptor[][];

    private readonly chunks: ChunkDescriptor[];

    private readonly loadedChunksByPositionDescriptor: Map<number, ChunkDescriptor[]> = new Map<number, ChunkDescriptor[]>();

    private shortMap: MapShort;

    private chunkSize: number = 8;

    public static tileLength: number = 50;

    private loadDistance: number = 2000;

    private readonly mapWidth: number;

    private readonly mapHeight: number;

    private mapRadius: number;

    private readonly mapCenterX:number;

    private readonly mapCenterY:number;

    public constructor() {
        let buffer: Buffer = fs.readFileSync(MapService.shortMapLocation);
        this.shortMap = JSON.parse(buffer.toString());
        this.tiles = this.loadMapShort(this.shortMap.map);

        this.mapWidth = this.tiles[0].length * MapService.tileLength;
        this.mapHeight = this.tiles.length * MapService.tileLength;

        this.mapCenterX = this.mapWidth / 2;
        this.mapCenterY = this.mapHeight / 2;

        this.mapRadius = this.calcRadius();

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
                        j * MapService.tileLength,
                        i * MapService.tileLength,
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

    public getLocation(playerDescriptor: PlayerDescriptor): UpdateChunksMessage {

        console.log("Update chunks for ", playerDescriptor, " : ", playerDescriptor.id);

        let chunkDescriptors = this.loadedChunksByPositionDescriptor.get(playerDescriptor.id);

        let toUnloadIds = new Array<number>();

        let toLoadChunks = new Array<ChunkDescriptor>();

        let alreadyLoaded: Set<number> = new Set<number>();

        let loadDist = this.loadDistance * this.loadDistance;

        if (chunkDescriptors !== undefined) {
            let newChunkDescr = new Array<ChunkDescriptor>();
            chunkDescriptors.forEach(value => {
                let chunkX = value.x + this.chunkSize * MapService.tileLength / 2 - playerDescriptor.x;
                let chunkY = value.y + this.chunkSize * MapService.tileLength / 2 - playerDescriptor.y;
                if (chunkX * chunkX + chunkY * chunkY > loadDist && !alreadyLoaded.has(value.id)) {
                    toUnloadIds.push(value.id);
                } else {
                    alreadyLoaded.add(value.id);
                    newChunkDescr.push(value);
                }
            });
            chunkDescriptors = newChunkDescr;
        } else {
            chunkDescriptors = this.loadedChunksByPositionDescriptor.set(playerDescriptor.id, []).get(playerDescriptor.id);
        }

        // TODO Генерация карты....
        this.chunks.forEach(value => {
            let chunkX = value.x + this.chunkSize * MapService.tileLength / 2 - playerDescriptor.x;
            let chunkY = value.y + this.chunkSize * MapService.tileLength / 2 - playerDescriptor.y;
            let loadDist = this.loadDistance * this.loadDistance;
            if (chunkX * chunkX + chunkY * chunkY < loadDist && !alreadyLoaded.has(value.id)) {
                toLoadChunks.push(value);
                chunkDescriptors.push(value);
            }
        });

        this.loadedChunksByPositionDescriptor.set(playerDescriptor.id, chunkDescriptors);

        console.log("to load = " + toLoadChunks.length);

        console.log("to unload = " + toUnloadIds.length);

        return {
            loadChunks: toLoadChunks,
            unloadIds: toUnloadIds
        } as UpdateChunksMessage;
    }

    private t = 0;

    public getBorder(): BorderDescriptor {
        if (this.t >= 10) {
            this.t = 0;
            this.mapRadius -= 0.01;
            this.mapRadius = Math.max(600, this.mapRadius);
        }
        this.t++;
        return {
            x: this.mapCenterX,
            y: this.mapCenterY,
            r: this.mapRadius,
            objectType: "border"
        } as BorderDescriptor;
    }

    private makeChunks(t: TileDescriptor[][]): ChunkDescriptor[] {
        let cd: Array<ChunkDescriptor> = new Array<ChunkDescriptor>();
        let cid: number = 1;
        let chunksCount: number = 0;
        for (let chunkX = 0; chunkX < t.length / this.chunkSize; chunkX++) {
            for (let chunkY = 0; chunkY < t[0].length / this.chunkSize; chunkY++) {
                let ccd = {
                    x: chunkX * this.chunkSize * MapService.tileLength,
                    y: chunkY * this.chunkSize * MapService.tileLength,
                    id: cid,
                    td: []
                } as ChunkDescriptor;
                cid++;
                for (let i = this.chunkSize * chunkX; i < Math.min(this.chunkSize * (chunkX + 1), t[0].length); i++) {
                    for (let j = this.chunkSize * chunkY; j < Math.min(this.chunkSize * (chunkY + 1), t.length); j++) {
                        t[j][i].chunkId = ccd.id;
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

    public resetBorder() {
        this.mapRadius = this.calcRadius();
    }

    private calcRadius() {
        return Math.sqrt(this.mapCenterX * this.mapCenterX + this.mapCenterY * this.mapCenterY);
    }
}