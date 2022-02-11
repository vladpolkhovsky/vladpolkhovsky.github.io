import {Container} from "pixi.js";
import {Tile} from "./Tile"
import {TileDescriptor} from "./discriptors/TileDescriptor";
import {TileBuilder} from "./builders/TileBuilder";
import {TileType} from "./TileType";

export class Level {

    private container: Container = new Container();

    private tileContainer: Container = new Container();

    private tiles: Tile[] = [];

    private constructor() {

    }

    public static builder(): Level {
        return new Level();
    }

    public static parseItem(x: number, y: number, tile: string): TileDescriptor {
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

    public getContainer(): Container {
        return this.container;
    }

    public loadMapShort(map: string[][]): Level {
        let tdMap: TileDescriptor[][] = new Array<TileDescriptor[]>();
        for (let i = 0; i < map.length; i++) {
            tdMap.push([]);
            for (let j = 0; j < map[i].length; j++) {
                tdMap[i].push(Level.parseItem(
                        j * TileBuilder.DEFAULT_TILE_LEN,
                        i * TileBuilder.DEFAULT_TILE_LEN,
                        map[i][j]
                    )
                );
            }
        }
        console.log(tdMap);
        return this.loadMapFromTileDescriptorArray(tdMap);
    }

    public loadMapFromTileDescriptorArray(map: TileDescriptor[][]): Level {

        map.forEach(row => {
            row.forEach(td => {
                let cTile: Tile = TileBuilder.buildTile(td);
                cTile.attach(this.tileContainer)
                this.tiles.push(cTile);
            });
        });

        this.container.addChild(this.tileContainer);

        return this;
    }

    public attach(parent: Container) {
        parent.addChild(this.container);
    }

}