import {Server} from "socket.io";
import {MapService} from "../map/MapService";
import {SocketService} from "./SocketService";
import {KeyService} from "../core/KeyService";

export class ConnectionHandler {

    private static stringPort: string = process.env.PORT;
    private static port: number = 5000;

    private server: Server;

    private mapService: MapService;

    private keyService: KeyService;

    private socketService: SocketService;

    public constructor(mapService: MapService, socketService: SocketService, keyService:KeyService) {
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
        this.setup();
    }

    public getServer():Server {
        return this.server;
    }

    private setup() {
        this.server.on("connection", (socket) => {

            let socketId = this.socketService.register(socket);

            console.log("new connection, id = " + socketId);

            socket.on("keydown", (key:string) => {
                this.keyService.regKeyDown(socketId, key);
            });

            socket.on("keyup", (key:string) => {
                this.keyService.regKeyUp(socketId, key);
            });

            socket.on("disconnect", socket => {
                this.socketService.unRegister(socket);
            });
        });
    }

}