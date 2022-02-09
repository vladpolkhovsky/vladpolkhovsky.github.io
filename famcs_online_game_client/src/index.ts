import {Application} from "pixi.js"

export function init() {
    const app: Application = new Application({
        width: 480,
        height: 640,
        backgroundColor: 0x41729F
    });
    document.body.appendChild(app.view);
}