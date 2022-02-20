import {Socket} from "socket.io";

export class SocketService {

    private nextFreeId = 0;

    private socketToId: Map<Socket, number> = new Map<Socket, number>();

    private idToSocket: Map<number, Socket> = new Map<number, Socket>();

    public constructor() {

    }

    public getNextId(): number {
        let cId = this.nextFreeId;
        this.nextFreeId++;
        return cId;
    }

    public register(socket: Socket): number {
        let cId = this.getNextId();
        console.log("register new socket with id: " + cId);
        this.idToSocket.set(cId, socket);
        this.socketToId.set(socket, cId);
        return cId;
    }

    public unRegister(socket: Socket) {
        let cId = this.socketToId.get(socket);
        console.log("unregister socket with id: " + cId);
        this.idToSocket.delete(cId);
        this.socketToId.delete(socket);
    }

    public getAllPlayersIds(): number[] {
        return Array.from(this.socketToId.values());
    }

    public getId(socket: Socket): number {
        return this.socketToId.get(socket);
    }

    public getSocket(id: number) {
        return this.idToSocket.get(id);
    }
}