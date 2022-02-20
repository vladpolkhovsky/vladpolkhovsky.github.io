import {SocketService} from "../network/SocketService";
import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {MapService} from "../map/MapService";
import {ConnectionHandler} from "../network/ConnectionHandler";
import {KeyService} from "./KeyService";
import {PlayerDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PlayerDescriptor";
import {MovementProcessor} from "./MovementProcessor";
import {PlayerState} from "./PlayerState";
import {Socket} from "socket.io";

export class Engine {

    private static TickRate = 6;

    private idToPlayerState: Map<number, PlayerState> = new Map<number, PlayerState>();

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
        this.idToPlayerState.set(
            id,
            {
                id: id,
                playerPosition: positionDescriptor
            } as PlayerState
        );
        this.connectionHandler.initConnection(
            id,
            this.idToPlayerState.get(id).playerPosition,
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

        this.movementProcessor.tick(dt);

        if (this.itCount % 3 == 0) {
            this.connectionHandler.getServer()
                .sockets.emit("update", this.makeUpdateRenounce());
        }

        this.itCount++;
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }


    private makeUpdateRenounce(): PlayerDescriptor[] {

        this.movementProcessor.getPositions().forEach(value => {
            this.idToPlayerState.get(value[0]).playerPosition = value[1];
        })

        let pd: Array<PlayerDescriptor> = new Array<PlayerDescriptor>(this.idToPlayerState.size);

        let index = 0;
        this.idToPlayerState.forEach((value, key) => {
            pd[index] = {
                id: value.id,
                x: value.playerPosition.x,
                y: value.playerPosition.y,
                objectType: "player"
            } as PlayerDescriptor;
            index++;
        });

        return pd;
    }

    public processDisconnect(socketId: number):void {
        this.movementProcessor.processDisconnect(socketId);
        this.keyService.processDisconnect(socketId);
        this.idToPlayerState.delete(socketId);
    }
}