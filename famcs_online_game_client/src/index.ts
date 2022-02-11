import {Application} from "pixi.js"
import {ViewController} from "./controllers/ViewController"
import {Level} from "./map/Level"

export function init() {

    const app: Application = new Application({
        width: 1080,
        height: 720,
        backgroundColor: 0x41729F
    });

    document.body.appendChild(app.view);

    let level: Level = Level.builder().loadMapShort(defaultMap);
    level.attach(app.stage);

    app.stage.addChild(level.getContainer());

    let viewController: ViewController = new ViewController(app, level.getContainer());

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