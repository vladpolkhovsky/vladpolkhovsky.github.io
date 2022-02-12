import {Application} from "pixi.js";
import {ViewController} from "../controllers/ViewController";
import {Level} from "../map/Level";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {TileDescriptor} from "../map/discriptors/TileDescriptor";

export class Game {

    private app: Application;

    private connectionHandler: ConnectionHandler;

    private viewController: ViewController;

    private level: Level;

    public constructor(parentElement: HTMLElement, connectionUrl: string) {
        this.app = new Application({
            width: 1080,
            height: 720,
            backgroundColor: 0x41729F
        });
        this.connectionHandler = new ConnectionHandler(connectionUrl, this);
        parentElement.appendChild(this.app.view);
    }

    public getApplication(): Application {
        return this.app;
    }

    public clearData() {
        console.log("Clear level");
        this.level.clear();
    }

    public loadMap(td: TileDescriptor[][]) {
        this.level = Level.builder().loadMapFromTileDescriptorArray(td);
        this.level.attach(this.app.stage);
        this.viewController = new ViewController(this.app, this.level.getContainer());
    }

}