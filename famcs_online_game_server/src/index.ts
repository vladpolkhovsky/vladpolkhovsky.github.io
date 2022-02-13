import {MapService} from "./map/MapService";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {SocketService} from "./network/SocketService";
import {Engine} from "./core/Engine";
import {KeyService} from "./core/KeyService";

let mapService: MapService = new MapService();
let socketService: SocketService = new SocketService();
let keyService: KeyService = new KeyService();
let connectionHandler: ConnectionHandler = new ConnectionHandler(mapService, socketService, keyService);
let engine: Engine = new Engine(socketService, mapService, connectionHandler, keyService);