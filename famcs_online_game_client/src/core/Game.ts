import {Application} from "pixi.js";
import {ViewController} from "../controllers/ViewController";
import {Level} from "../map/Level";

export class Game {

    private app: Application;

    private connectionHandler;

    private viewController: ViewController;

    private level:Level;

    public constructor(canvas: HTMLCanvasElement) {
        this.app = new Application({
            width: 1080,
            height: 720,
            backgroundColor: 0x41729F
        });
    }

    public getApplication(): Application {
        return this.app;
    }

    public init() {

    }



}