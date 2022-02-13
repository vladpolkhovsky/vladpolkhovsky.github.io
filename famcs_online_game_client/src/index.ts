import {Game} from "./core/Game";
import {Loader} from "pixi.js";

export function init() {
    let connection_url = 'localhost:5000';
    if (document.domain === 'vladpolkhovsky.github.io') {
        connection_url = 'https://famcs-game-server.herokuapp.com/';
    }
    let game: Game = new Game(document.body, connection_url);
}