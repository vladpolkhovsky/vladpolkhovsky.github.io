import {io, Socket} from "socket.io-client"
import {Game} from "../Game";
import {InitMessage} from "./InitMessage";
import {GameDescriptor} from "../../map/discriptors/GameDescriptor";
import {UpdateChunksMessage} from "./UpdateChunksMessage";

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

    public getSocket(): Socket {
        return this.socket;
    }

    private setup(game: Game) {
        this.game = game;

        console.log("Client try to connect:");

        this.socket.on("connect", () => {
            console.log("client connected");

            this.socket.on("initialize", (initMessage: InitMessage) => {
                console.log("initialize message:", initMessage);
                this.game.loadMap(initMessage.chunks, initMessage.player);
                this.game.updateState([initMessage.border]);
            });

            this.socket.on("update_chunks", (chunksData: UpdateChunksMessage) => {
                console.log("update chunks message. load: ", chunksData.loadChunks.length);
                this.game.update(chunksData.loadChunks);
                this.game.unload(chunksData.loadChunks);
            })

            this.socket.on("disconnect_player", (id) => {
                this.game.processDisconnect(id);
            });

            this.socket.on("update", (pd: GameDescriptor[]) => {
                this.game.updateState(pd);
            });

            this.socket.on("clear", () => {
                this.game.clearData();
            });

        });

    }

}