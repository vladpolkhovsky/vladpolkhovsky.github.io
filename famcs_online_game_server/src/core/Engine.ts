import {SocketService} from "../network/SocketService";
import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {MapService} from "../map/MapService";
import {ConnectionHandler} from "../network/ConnectionHandler";
import {KeyService} from "./KeyService";
import {PlayerDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PlayerDescriptor";
import {MovementProcessor} from "./MovementProcessor";
import {PlayerState} from "./PlayerState";
import {Socket} from "socket.io";
import {GameDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/GameDescriptor";
import {BorderDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/BorderDescriptor";

export class Engine {

    private static TickRate = 6;

    public idToPlayerState: Map<number, PlayerState> = new Map<number, PlayerState>();

    private socketService: SocketService;

    private mapService: MapService;

    private connectionHandler: ConnectionHandler;

    private keyService: KeyService;

    private movementProcessor: MovementProcessor;

    private lastExecTime: number = new Date().getTime();

    public constructor(socketService: SocketService,
                       mapService: MapService,
                       connectionHandler: ConnectionHandler,
                       keyService: KeyService,
                       movementProcessor: MovementProcessor) {

        this.mapService = mapService;
        this.socketService = socketService;
        this.connectionHandler = connectionHandler;
        this.keyService = keyService;
        this.movementProcessor = movementProcessor
        this.connectionHandler.attachEngine(this);

        this.updateTime();
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }

    public processConnection(id: number, socket: Socket): void {
        let positionDescriptor = this.movementProcessor.processConnection(id);
        let isThisFirstPlayer: boolean = false;
        if (this.idToPlayerState.size === 0) {
            isThisFirstPlayer = true;
        }
        this.idToPlayerState.set(
            id,
            {
                id: id,
                type: isThisFirstPlayer ? "target" : "common",
                playerPosition: positionDescriptor
            } as PlayerState
        );
        this.connectionHandler.initConnection(
            id,
            this.idToPlayerState.get(id).playerPosition,
            this.idToPlayerState.get(id).type,
            socket
        );
    }

    private itCount: number = 0;

    private updateTime(): number {
        let dt = new Date().getTime() - this.lastExecTime;
        this.lastExecTime = new Date().getTime();
        return dt / 1000;
    }

    private gameLoopIteration(): void {
        let dt = this.updateTime();

        this.movementProcessor.tick(dt, this.idToPlayerState, this.mapService.getBorder());

        if (this.itCount % 3 == 0) {
            this.connectionHandler.getServer()
                .sockets.emit("update", this.makeUpdateRenounce());
        }

        this.itCount++;
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }

    private chunkLoadIteration: number = 0;

    private makeUpdateRenounce(): GameDescriptor[] {

        this.movementProcessor.getPositions().forEach(value => {
            this.idToPlayerState.get(value[0]).playerPosition = value[1];
        })

        let pd: Array<GameDescriptor> = new Array<GameDescriptor>(this.idToPlayerState.size);

        let index = 0;

        let chunkLoadIteration = this.chunkLoadIteration;

        this.idToPlayerState.forEach(value => {
            pd[index] = {
                id: value.id,
                x: value.playerPosition.x,
                y: value.playerPosition.y,
                type: value.type,
                objectType: "player"
            } as PlayerDescriptor;
            if (chunkLoadIteration == 0) {
                let location = this.mapService.getLocation(<PlayerDescriptor>pd[index]);
                this.socketService.getSocket(value.id).emit("update_chunks", location);
            }
            index++;
        })

        pd.push(this.mapService.getBorder());

        this.chunkLoadIteration += 1;
        if (this.chunkLoadIteration > 15) {
            this.chunkLoadIteration = 0;
        }

        return pd;
    }

    public processDisconnect(socketId: number):void {
        let wasTarget = this.idToPlayerState.get(socketId).type === "target";
        this.movementProcessor.processDisconnect(socketId);
        this.keyService.processDisconnect(socketId);
        this.idToPlayerState.delete(socketId);
        if (wasTarget) {
            if (this.idToPlayerState.size != 0) {
                let keys = this.idToPlayerState.keys();
                let next = keys.next()
                let playerState = this.idToPlayerState.get(next.value);
                playerState.type = "target";
                this.idToPlayerState.set(next.value, playerState);
            }
        }
    }
}