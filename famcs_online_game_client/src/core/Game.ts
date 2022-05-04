import {Application} from "pixi.js";
import {ViewController} from "../controllers/ViewController";
import {Level} from "../map/Level";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {TileDescriptor} from "../map/discriptors/TileDescriptor";
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";
import {Player} from "../map/Player";
import {KeyController} from "../controllers/KeyController";
import {GameDescriptor} from "../map/discriptors/GameDescriptor";
import {OtherObjectManager} from "./OtherObjectManager";
import {ChunkDescriptor} from "../map/discriptors/ChunkDescriptor";
import {BoxDescriptor} from "../map/discriptors/BoxDescriptor";
import {BorderDescriptor} from "../map/discriptors/BorderDescriptor";

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
            backgroundColor: 0x41729F,
            width: document.body.clientWidth,
            height: document.body.clientHeight
        });
        this.connectionHandler = new ConnectionHandler(connectionUrl, this);
        this.otherObjectManager = new OtherObjectManager();
        parentElement.appendChild(this.app.view);
    }

    public getApplication(): Application {
        return this.app;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public clearData() {
        console.log("Clear level");
        this.level.clear();
    }

    public loadMap(chunks: ChunkDescriptor[], playerDescriptor: PlayerDescriptor) {
        this.level = Level.builder().loadMapFromTileDescriptorArray(this.toTiles(chunks));
        this.player = Player.builder().load(playerDescriptor);
        this.level.attach(this.app.stage);
        this.player.attach(this.level.getContainer());
        this.otherObjectManager.attach(this.level.getContainer());
        this.viewController = new ViewController(this.app, this.level.getContainer());
        this.keyController = new KeyController(this.app, this.connectionHandler);
        this.viewController.translateCamera(playerDescriptor);
    }

    public unload(ids: ChunkDescriptor[]) {

        let loaded = new Set<number>();
        this.level.getChunkIdToTileMap().forEach(value => {
            value.forEach(vq => {
                loaded.add(vq.chunkId);
            });
        });

        let newLoaded = new Set<number>();
        ids.forEach(value => {
           newLoaded.add(value.id);
        });

        loaded.forEach(value => {
            if (!newLoaded.has(value)) {
                this.level.clearChunk(value);
            }
        });

    }

    public update(chunks: ChunkDescriptor[]) {
        //console.log("loaded count:", chunks.length);
        this.level.loadMapFromTileDescriptorArray(this.toTiles(chunks));
    }

    public updateState(pd: GameDescriptor[]) {
        pd.forEach(descriptor => {
            if (descriptor.objectType === "player") {
                let pDescriptor = <PlayerDescriptor>descriptor;
                if (pDescriptor.id === this.player.getDescriptor().id) {
                    let lastPLayerDescriptor = <PlayerDescriptor>this.player.getDescriptor();
                    this.player.applyDescriptor(pDescriptor);
                    this.viewController.followPlayer(lastPLayerDescriptor, pDescriptor);
                } else {
                    console.log("new player");
                    this.otherObjectManager.applyPlayer(pDescriptor);
                }
            }
            if (descriptor.objectType === "box") {
                let bDescriptor = <BoxDescriptor>descriptor;
                if (bDescriptor.id < 0) {
                    this.otherObjectManager.remove(-bDescriptor.id);
                } else {
                    this.otherObjectManager.applyBox(bDescriptor);
                }
            }
            if (descriptor.objectType === "border") {
                let bDescriptor = <BorderDescriptor>descriptor;
                this.otherObjectManager.applyBorder(bDescriptor);
            }
        })
    }

    private toTiles(chunks: ChunkDescriptor[]): TileDescriptor[][] {
        let cTiles: TileDescriptor[][] = [[]];
        chunks.forEach(chunk => {
            chunk.td.forEach(tile => {
                cTiles[0].push(tile);
            });
        });
        return cTiles;
    }

    public processDisconnect(id: number):void {
        this.otherObjectManager.remove(id);
    }
}