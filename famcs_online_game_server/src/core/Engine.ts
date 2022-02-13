import {SocketService} from "../network/SocketService";
import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {InitMessage} from "../../../famcs_online_game_client/src/core/network/InitMessage";
import {MapService} from "../map/MapService";
import {ConnectionHandler} from "../network/ConnectionHandler";
import {KeyService} from "./KeyService";
import {PlayerDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PlayerDescriptor";

export class Engine {

    private static TickRate = 6;

    private socketService: SocketService;

    private mapService: MapService;

    private connectionHandler: ConnectionHandler;

    private keyService: KeyService;

    private lastExecTime: number = new Date().getTime();

    private idToPosition: Map<number, PositionDescriptor> = new Map<number, PositionDescriptor>();

    public constructor(socketService: SocketService, mapService: MapService, connectionHandler: ConnectionHandler, keyService: KeyService) {
        this.mapService = mapService;
        this.socketService = socketService;
        this.connectionHandler = connectionHandler;
        this.keyService = keyService;
        this.updateTime();
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }

    private itCount: number = 0;

    private updateTime(): number {
        let dt = new Date().getTime() - this.lastExecTime;
        this.lastExecTime = new Date().getTime();
        return dt / 1000;
    }

    private gameLoopIteration(): void {
        let dt = this.updateTime();
        for (let cId in this.socketService.getAllPlayersIds()) {
            let id = parseInt(cId);
            this.movePlayer(id, dt);
        }
        if (this.itCount % 4 == 0) {
            this.connectionHandler.getServer().sockets.emit("update", this.makeUpdateRenounce());
        }
        this.itCount++;
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }

    private static speed = 100;

    private static dir: [string, number, number][] = [
        ["w", 0, -Engine.speed],
        ["a", -Engine.speed, 0],
        ["s", 0, Engine.speed],
        ["d", Engine.speed, 0]
    ];

    private movePlayer(id: number, dt: number) {
        let pd = this.idToPosition.get(id);

        if (pd === undefined) {
            pd = {
                x: Math.random() * 400,
                y: Math.random() * 400,
                id: id
            } as PositionDescriptor;
            this.idToPosition.set(id, pd);
            let socket = this.socketService.getSocket(id);
            socket.emit("initialize", {
                player: pd,
                tiles: this.mapService.getTilesDescriptors()
            } as InitMessage);
            socket.emit("update", this.makeUpdateRenounce());
        }

        let keyPressed = this.keyService.get(id);

        for (let i = 0; i < Engine.dir.length; i++) {
            if (keyPressed[Engine.dir[i][0]]) {
                pd.x = pd.x + Engine.dir[i][1] * dt;
                pd.y = pd.y + Engine.dir[i][2] * dt;
            }
        }

    }

    private makeUpdateRenounce() {
        let p: Array<[number, PositionDescriptor]> = Array.from<[number, PositionDescriptor]>(this.idToPosition.entries());
        console.log(p);
        let pd: Array<PlayerDescriptor> = new Array<PlayerDescriptor>(this.idToPosition.size);
        for (let i = 0; i < p.length; i++) {
            pd[i] = {
                objectType: "player",
                x: p[i][1].x,
                y: p[i][1].y,
                id: p[i][0]
            } as PlayerDescriptor;
        }
        return pd;
    }
}