import {Server, Socket} from "socket.io";
import {MapService} from "../map/MapService";
import {SocketService} from "./SocketService";
import {KeyService} from "../core/KeyService";
import {MovementProcessor} from "../core/MovementProcessor";
import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {InitMessage} from "../../../famcs_online_game_client/src/core/network/InitMessage";
import {PlayerDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PlayerDescriptor";
import {Engine} from "../core/Engine";

export class ConnectionHandler {

    private static stringPort: string = process.env.PORT;

    private static port: number = 5000;

    private server: Server;

    private mapService: MapService;

    private keyService: KeyService;

    private socketService: SocketService;

    private movementProcessor: MovementProcessor;

    private engine:Engine;

    public constructor(mapService: MapService, socketService: SocketService, keyService: KeyService, movementProcessor: MovementProcessor) {
        let port = ConnectionHandler.stringPort === undefined ? ConnectionHandler.port : parseInt(ConnectionHandler.stringPort);
        this.server = new Server(port, {
            transports: [
                "websocket"
            ]
        });
        console.log("Server started on port " + port);
        this.mapService = mapService;
        this.socketService = socketService;
        this.keyService = keyService;
        this.movementProcessor = movementProcessor;
        this.setup();
    }

    public getServer(): Server {
        return this.server;
    }

    private setup() {
        this.server.on("connection", (socket) => {

            let socketId = this.socketService.register(socket);

            this.engine.processConnection(socketId, socket);

            console.log("new connection, id = " + socketId);

            socket.on("keydown", (key: string) => {
                this.keyService.regKeyDown(socketId, key);
            });

            socket.on("keyup", (key: string) => {
                this.keyService.regKeyUp(socketId, key);
            });

            socket.on("disconnect", socket => {
                this.socketService.unRegister(socket);
                this.engine.processDisconnect(socketId);
                this.server.emit("disconnect_player", socketId);
            });
        });
    }

    public initConnection(socketId: number, positionDescriptor: PositionDescriptor, socket: Socket) {

        let playerDescriptor: PlayerDescriptor = {
            x: positionDescriptor.x,
            y: positionDescriptor.y,
            id: socketId
        } as PlayerDescriptor;

        socket.emit("initialize", {
            player: playerDescriptor,
            chunks: this.mapService.getLocation(playerDescriptor).loadChunks
        } as InitMessage);
    }

    public attachEngine(engine: Engine):void {
        this.engine = engine;
    }
}