import {Server} from "socket.io";
import {MapService} from "../map/MapService";
import {SocketService} from "./SocketService";

export class ConnectionHandler {

    private static stringPort: string = process.env.PORT;
    private static port: number = 5000;

    private server: Server;

    private mapService: MapService;
    private socketService: SocketService;

    public constructor(mapService: MapService, socketService: SocketService) {
        let port = ConnectionHandler.stringPort === undefined ? ConnectionHandler.port : parseInt(ConnectionHandler.stringPort);
        this.server = new Server(port, {
            transports: [
                "websocket"
            ]
        });
        console.log("Server started on port " + port);
        this.mapService = mapService;
        this.socketService = socketService;
        this.setup();
    }

    private setup() {
        this.server.on("connection", (socket) => {
            console.log("new connection.")
            this.socketService.register(socket);
            socket.on("disconnect", socket => {
                this.socketService.unRegister(socket);
            });
        });
    }

}