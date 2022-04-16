import {MapService} from "./map/MapService";
import {ConnectionHandler} from "./network/ConnectionHandler";
import {SocketService} from "./network/SocketService";
import {Engine} from "./core/Engine";
import {KeyService} from "./core/KeyService";
import {MovementProcessor} from "./core/MovementProcessor";

let mapService: MapService = new MapService();

let socketService: SocketService = new SocketService();

let keyService: KeyService = new KeyService();

let movementProcessor: MovementProcessor = new MovementProcessor(keyService, mapService);

let connectionHandler: ConnectionHandler = new ConnectionHandler(mapService, socketService, keyService, movementProcessor);

let engine: Engine = new Engine(socketService, mapService, connectionHandler, keyService, movementProcessor);
