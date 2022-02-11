import {io, Socket} from "socket.io-client"
import {Game} from "../Game";
import {ServerToClientEvents} from "./ServerToClinetEvents";
import {ClientToServerEvents} from "./ClientToServerEvents";

export class ConnectionHandler {

    private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

    private game: Game;

    public constructor(connectionUrl: string, game: Game) {
        this.socket = io(connectionUrl);
        this.setup(game);
    }

    private setup(game: Game) {
        this.game = game;

        this.socket.on("connect", () => {
            this.socket.on("initialize", td => {

            })
        })

    }

}