import {Game} from "./core/Game";

export function init() {
    let game: Game = new Game(document.body, "localhost:5000");
}