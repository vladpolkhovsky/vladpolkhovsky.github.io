import {Game} from "./core/Game";

export function init() {
    console.log(document.domain);
    let game: Game = new Game(document.body, "localhost:5000");
}