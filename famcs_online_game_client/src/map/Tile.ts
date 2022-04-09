import {Container, Graphics} from "pixi.js"

export class Tile {

    private static defaultColor = 0xff00ff;

    private graph: Graphics = new Graphics();

    private chunkId: number;

    private x: number;

    private y: number;

    private len: number;

    private parent: Container;

    constructor(x: number, y: number, len: number, chunkId:number, color?: number) {
        this.x = x;
        this.y = y;
        this.len = len;
        this.chunkId = chunkId;

        let fColor = color === undefined ? Tile.defaultColor : color;

        this.graph.beginFill(fColor);
        this.graph.drawRect(x, y, len, len);
    }

    public attach(parent: Container) {
        this.parent = parent;
        parent.addChild(this.graph);
    }

    public unAttach() {
        this.parent.removeChild(this.graph);
    }

    public getParent(): Container {
        return this.parent;
    }


}