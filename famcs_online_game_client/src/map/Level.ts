import {Container} from "pixi.js";
import {Tile} from "./Tile"
import {TileDescriptor} from "./discriptors/TileDescriptor";
import {TileBuilder} from "./builders/TileBuilder";

export class Level {

    private container: Container = new Container();

    private tileContainer: Container = new Container();

    private chunkIdToTileMap: Map<number, Tile[]> = new Map<number, Tile[]>();

    private constructor() {
        this.container.sortableChildren = true;
    }

    public getChunkIdToTileMap(): Map<number, Tile[]> {
        return this.chunkIdToTileMap;
    };

    public static builder(): Level {
        return new Level();
    }

    public getContainer(): Container {
        return this.container;
    }

    public loadMapFromTileDescriptorArray(map: TileDescriptor[][]): Level {

        //console.log("load map", this.chunkIdToTileMap, map);

        let loaded = new Set<number>();
        this.chunkIdToTileMap.forEach(value => {
           value.forEach(vq => {
              loaded.add(vq.chunkId);
           });
        });

        map.forEach(row => {
            row.forEach(td => {
                if (!loaded.has(td.chunkId)) {
                    let cTile: Tile = TileBuilder.buildTile(td);
                    cTile.attach(this.tileContainer)

                    let tiles = this.chunkIdToTileMap.get(td.chunkId);
                    if (tiles === undefined) {
                        tiles = this.chunkIdToTileMap.set(td.chunkId, []).get(td.chunkId);
                    }

                    tiles.push(cTile);
                }
            });
        });

        this.container.addChild(this.tileContainer);

        return this;
    }

    public clearChunk(chunkId: number) {
        let tiles = this.chunkIdToTileMap.get(chunkId);
        if (tiles !== undefined) {
            tiles.forEach(value => {
                value.unAttach();
            });
        }
        this.chunkIdToTileMap.delete(chunkId);
    }

    public attach(parent: Container) {
        parent.addChild(this.container);
    }

    public clear() {
        this.chunkIdToTileMap.forEach(value => {
            value.forEach(value1 => {
                value1.unAttach();
            });
        });
        this.container.setTransform(0, 0);
        this.chunkIdToTileMap.clear();
        this.container.removeChildren();
    }

}