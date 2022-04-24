import {Application} from "pixi.js";
import {ConnectionHandler} from "../core/network/ConnectionHandler";

export class KeyController {

    private connectionHandler: ConnectionHandler;

    public constructor(app: Application, connectionHandler: ConnectionHandler) {
        this.connectionHandler = connectionHandler;
        this.attachEvents(document.body);
    }

    public static controlKeys: Array<String> = ["wWцЦ", "aAфФ", "sSыЫ", "dDвВ"];

    private attachEvents(canvas: HTMLElement) {

        console.log("attach event");

        canvas.addEventListener("keydown", (ev) => {
            KeyController.controlKeys.forEach(value => {
                if (value.indexOf(ev.key) != -1) {
                    this.connectionHandler.getSocket().emit("keydown", value.charAt(0));
                }
            });
        });

        canvas.addEventListener("keyup", (ev) => {
            KeyController.controlKeys.forEach(value => {
                if (value.indexOf(ev.key) != -1) {
                    this.connectionHandler.getSocket().emit("keyup", value.charAt(0));
                }
            });
        });

    }
}