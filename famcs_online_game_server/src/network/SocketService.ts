import { Socket } from "socket.io";

export class SocketService {

    private nextFreeId = 0;

    private socketToId:Map<Socket, number> = new Map<Socket, number>();

    private idToSocket:Map<number, Socket> = new Map<number, Socket>();

    public constructor() {

    }

    public register(socket:Socket) {
        let cId = this.nextFreeId;
        this.nextFreeId++;
        console.log("register new socket with id: " + cId);
        this.idToSocket.set(cId, socket);
        this.socketToId.set(socket, cId);
    }

    public unRegister(socket:Socket) {
        let cId = this.socketToId.get(socket);
        console.log("unregister socket with id: " + cId);
        this.idToSocket.delete(cId);
        this.socketToId.delete(socket);
    }

    public getId(socket:Socket): number {
        return this.socketToId.get(socket);
    }

}