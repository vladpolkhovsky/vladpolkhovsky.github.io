import {Application} from "pixi.js";
import {ConnectionHandler} from "../core/network/ConnectionHandler";

export class KeyController {

    private connectionHandler: ConnectionHandler;

    public constructor(app: Application, connectionHandler: ConnectionHandler) {
        this.connectionHandler = connectionHandler;
        this.attachEvents(document.body);
    }

    public static controlKeys: Array<String> = ["w", "a", "s", "d"];

    private attachEvents(canvas: HTMLElement) {

        console.log("attach event");

        canvas.addEventListener("keydown", (ev) => {
            if (KeyController.controlKeys.lastIndexOf(ev.key.toLocaleLowerCase()) != -1) {
                console.log("MOVE");
                this.connectionHandler.getSocket().emit("keydown", ev.key);
            }
        });

        canvas.addEventListener("keyup", (ev) => {
            if (KeyController.controlKeys.lastIndexOf(ev.key.toLocaleLowerCase()) != -1) {
                this.connectionHandler.getSocket().emit("keyup", ev.key);
            }
        });

    }
}