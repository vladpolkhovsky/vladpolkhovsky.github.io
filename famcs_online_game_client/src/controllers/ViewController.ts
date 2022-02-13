import {Application, Container} from "pixi.js"

export class ViewController {

    private mouseDown: boolean;

    private container: Container;

    constructor(app: Application, container: Container) {
        this.mouseDown = false;
        this.container = container;
        this.attachEvents(document.body);
    }

    private attachEvents(canvas: HTMLElement) {

        canvas.addEventListener("mousedown", ev => {
            this.mouseDown = true;
        });

        canvas.addEventListener("mouseup", ev => {
            this.mouseDown = false;
        });

        canvas.addEventListener("mousemove", ev => {
            if (this.mouseDown) {
                let newX = ev.movementX + this.container.position.x;
                let newY = ev.movementY + this.container.position.y;
                this.container.x = newX;
                this.container.y = newY;
            }
        });

        canvas.addEventListener("wheel", ev => {
            this.container.scale.set(
                Math.min(2, Math.max(this.container.scale.x + ev.deltaY / 150, 0.5))
            );
        });

    }

}