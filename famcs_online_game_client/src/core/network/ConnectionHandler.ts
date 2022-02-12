import {io, Socket} from "socket.io-client"
import {Game} from "../Game";

export class ConnectionHandler {

    private socket: Socket;

    private game: Game;

    public constructor(connectionUrl: string, game: Game) {
        this.socket = io(connectionUrl, {
            transports: [
                "websocket"
            ]
        });

        this.setup(game);
    }

    private setup(game: Game) {
        this.game = game;

        console.log("Client try to connect:");

        this.socket.on("connect", () => {
            console.log("client connected");

            this.socket.on("initialize", td => {
                console.log("initialize message:", td);
                game.loadMap(td);
            });

            this.socket.on("clear", () => {
                this.game.clearData();
            });

        });

    }

}