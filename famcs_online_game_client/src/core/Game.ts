import {Application} from "pixi.js";
import {ViewController} from "../controllers/ViewController";
import {Level} from "../map/Level";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {TileDescriptor} from "../map/discriptors/TileDescriptor";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";
import {Player} from "../map/Player";
import {KeyController} from "../controllers/KeyController";
import { GameDescriptor } from "../map/discriptors/GameDescriptor";
import {OtherObjectManager} from "./OtherObjectManager";

export class Game {

    private app: Application;

    private connectionHandler: ConnectionHandler;

    private viewController: ViewController;

    private keyController: KeyController;

    private level: Level;

    private player: Player;

    private otherObjectManager: OtherObjectManager;

    public constructor(parentElement: HTMLElement, connectionUrl: string) {
        this.app = new Application({
            width: 1080,
            height: 720,
            backgroundColor: 0x41729F
        });
        this.connectionHandler = new ConnectionHandler(connectionUrl, this);
        this.otherObjectManager = new OtherObjectManager();
        parentElement.appendChild(this.app.view);
    }

    public getApplication(): Application {
        return this.app;
    }

    public getPlayer():Player {
        return this.player;
    }

    public clearData() {
        console.log("Clear level");
        this.level.clear();
    }

    public loadMap(td: TileDescriptor[][], playerDescriptor:PlayerDescriptor) {
        this.level = Level.builder().loadMapFromTileDescriptorArray(td);
        this.player = Player.builder().load(playerDescriptor);
        this.level.attach(this.app.stage);
        this.player.attach(this.level.getContainer());
        this.otherObjectManager.attach(this.level.getContainer());
        this.viewController = new ViewController(this.app, this.level.getContainer());
        this.keyController = new KeyController(this.app, this.connectionHandler);
    }

    public updateState(pd: GameDescriptor[]) {
        pd.forEach(descriptor => {
            if (descriptor.objectType === "player") {
                let pDescriptor = <PlayerDescriptor>descriptor;
                if (pDescriptor.id == this.player.getDescriptor().id) {
                    this.player.applyDescriptor(pDescriptor);
                } else {
                    this.otherObjectManager.apply(pDescriptor);
                }
            }
        })
    }
}