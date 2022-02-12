import {TileDescriptor} from "../../famcs_online_game_client/src/map/discriptors/TileDescriptor"
import {TileType} from "../../famcs_online_game_client/src/map/TileType"
import {Server} from "socket.io"

const server: Server = new Server(5000, {
    transports: [
        "websocket"
    ]
});

console.log("Server started:");

server.on("connection", (socket) => {
    console.log("client connected");
    socket.emit("initialize", loadMapShort(defaultMap));
})

function loadMapShort(map: string[][]): TileDescriptor[][] {
    let tdMap: TileDescriptor[][] = new Array<TileDescriptor[]>();
    for (let i = 0; i < map.length; i++) {
        tdMap.push([]);
        for (let j = 0; j < map[i].length; j++) {
            tdMap[i].push(parseItem(
                    j * 50,
                    i * 50,
                    map[i][j]
                )
            );
        }
    }
    return tdMap;
}

function parseItem(x: number, y: number, tile: string): TileDescriptor {
    let type: string;

    if (tile === "G") {
        type = TileType[TileType.Grass];
    }

    if (tile === "R") {
        type = TileType[TileType.Road];
    }
    return {
        x: x,
        y: y,
        type: type
    } as TileDescriptor;
}

const defaultMap: string[][] = [
    ["R", "R", "R", "G", "G", "G", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["R", "R", "R", "G", "G", "G", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["R", "R", "R", "G", "G", "G", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "R", "R", "R", "R", "R", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "R", "R", "R", "R", "R", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "R", "R", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "R", "R", "G", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "R", "R", "G", "G", "G", "R", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
    ["G", "G", "G", "G", "G", "G", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"]
]