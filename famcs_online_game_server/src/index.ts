import {MapService} from "./map/MapService";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {SocketService} from "./network/SocketService";

let mapService: MapService = new MapService();
let socketService: SocketService = new SocketService();
let connectionHandler: ConnectionHandler = new ConnectionHandler(mapService, socketService);