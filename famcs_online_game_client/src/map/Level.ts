import {Container} from "pixi.js";
import {Tile} from "./Tile"
import {TileDescriptor} from "./discriptors/TileDescriptor";
import {TileBuilder} from "./builders/TileBuilder";

export class Level {

    private container: Container = new Container();

    private tileContainer: Container = new Container();

    private tiles: Tile[] = [];

    private constructor() {

    }

    public static builder(): Level {
        return new Level();
    }

    public getContainer(): Container {
        return this.container;
    }

    public loadMapFromTileDescriptorArray(map: TileDescriptor[][]): Level {

        console.log("get message");

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

    public clear() {
        this.container.setTransform(0, 0);
        this.container.removeChildren();
        this.tiles = [];
    }
}