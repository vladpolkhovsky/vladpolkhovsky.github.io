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
import {BoxDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/BoxDescriptor";

export class Engine {

    private static TickRate = 6;

    public idToPlayerState: Map<number, PlayerState> = new Map<number, PlayerState>();

    public idToBoxDescriptor: Map<number, BoxDescriptor> = new Map<number, BoxDescriptor>();

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

    private readonly BOX_SPAWN_TIMER_LIMIT = 10;
    private readonly BOX_LIMIT = 15;

    private boxSpawnTimer = 10;

    private nextBoxId = 1;

    private boxCount = 0;

    private gameLoopIteration(): void {
        let dt = this.updateTime();

        let borderDescriptor: BorderDescriptor = this.mapService.getBorder(dt);

        this.movementProcessor.tick(dt, this.idToPlayerState, borderDescriptor);

        let toDelete: Set<number> = new Set<number>();

        this.idToBoxDescriptor.forEach((value, key) => {
            if (value.id < 0) {
                return;
            }
            this.idToPlayerState.forEach((pvalue, pkey) => {
                if (!toDelete.has(key) && Math.pow(value.x - pvalue.playerPosition.x, 2) + Math.pow(value.y - pvalue.playerPosition.y, 2) < Math.pow(16, 2)) {
                    this.movementProcessor.addSpeedBonus(pkey);
                    console.log("Get box at: ", value);
                    toDelete.add(key);
                    this.boxCount--;
                }
            });
            if (Math.pow(!toDelete.has(key) && value.x - borderDescriptor.x, 2) + Math.pow(value.y - borderDescriptor.y, 2) > Math.pow(borderDescriptor.r, 2)) {
                console.log("Out of range box: ", value);
                toDelete.add(key);
                this.boxCount--;
            }
        });

        if (toDelete.size > 0) {
            console.log("to delete: ", toDelete);
        }

        toDelete.forEach(value => {
           let boxDescriptor = this.idToBoxDescriptor.get(value);
           boxDescriptor.id = -boxDescriptor.id;
           this.idToBoxDescriptor.set(value, boxDescriptor);
        });

        this.boxSpawnTimer -= dt;
        if (this.boxSpawnTimer < 0) {
            this.boxSpawnTimer = this.BOX_SPAWN_TIMER_LIMIT;

            if (this.boxCount < this.BOX_LIMIT) {

                let x: number = 2 * Math.random() * borderDescriptor.r - borderDescriptor.r;
                let y: number = 2 * Math.random() * borderDescriptor.r - borderDescriptor.r;
                let id: number = this.nextBoxId;

                this.nextBoxId++;

                let z = Math.sqrt(x * x + y * y);

                x /= z;
                y /= z;

                x = Math.random() * x * borderDescriptor.r + borderDescriptor.x;
                y = Math.random() * y * borderDescriptor.r + borderDescriptor.y;

                let boxDescriptor = {
                    objectType: "box",
                    id: id,
                    x: x,
                    y: y
                } as BoxDescriptor;

                this.idToBoxDescriptor.set(id, boxDescriptor)

                console.log("Box spawn at: ", boxDescriptor)

                this.boxCount++;
            }
        }

        if (this.itCount % 3 == 0) {
            this.connectionHandler.getServer()
                .sockets.emit("update", this.makeUpdateRenounce(borderDescriptor));
        }

        this.itCount++;
        setTimeout(() => this.gameLoopIteration(), Engine.TickRate);
    }

    private chunkLoadIteration: number = 0;

    private makeUpdateRenounce(borderDescriptor: BorderDescriptor): GameDescriptor[] {

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

        let toDeleteBox: Array<number> = [];

        this.idToBoxDescriptor.forEach((value, key) => {
            if (value.id < 0) {
                toDeleteBox.push(key);
            }
            pd.push(value);
        });

        toDeleteBox.forEach(value => {
           this.idToBoxDescriptor.delete(value);
        });

        pd.push(borderDescriptor);

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