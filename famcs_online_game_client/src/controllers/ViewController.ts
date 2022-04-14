import {Application, Container, Graphics, IPointData} from "pixi.js"
import {PlayerDescriptor} from "../map/discriptors/PlayerDescriptor";

export class ViewController {

    private mouseDown: boolean;

    private container: Container;

    private canvasPositionX;

    private canvasPositionY;

    private canvasHeight;

    private canvasWidth;

    constructor(app: Application, container: Container) {
        this.mouseDown = false;
        this.container = container;
        this.attachEvents(document.body);
        this.canvasPositionX = app.view.getBoundingClientRect().x;
        this.canvasPositionY = app.view.getBoundingClientRect().y;
        this.canvasHeight = app.view.height;
        this.canvasWidth = app.view.width;
    }

    private lastEventTime: number = Date.now();

    private attachEvents(canvas: HTMLElement) {

        canvas.addEventListener("mousedown", ev => {
            this.mouseDown = true;
            this.lastEventTime = Date.now();
        });

        canvas.addEventListener("mouseup", ev => {
            this.mouseDown = false;
            this.lastEventTime = Date.now();
        });

        canvas.addEventListener("dblclick", ev => {
            if (!this.mouseDown) {
                let point = this.container.toLocal({
                    x: ev.x - this.canvasPositionX,
                    y: ev.y - this.canvasPositionY
                } as IPointData);
                let g = new Graphics();
                g.beginFill(0xfffff);
                g.drawCircle(point.x - 5, point.y - 5, 10);
                this.container.addChild(g);
            }
        });

        canvas.addEventListener("mousemove", ev => {
            if (this.mouseDown) {
                let newX = ev.movementX + this.container.position.x;
                let newY = ev.movementY + this.container.position.y;
                this.container.x = newX;
                this.container.y = newY;
                this.lastEventTime = Date.now();
            }
        });

        canvas.addEventListener("wheel", ev => {
            let lastHeight = this.container.height;
            let lastWidth = this.container.width;
            this.container.scale.set(
                Math.min(2, Math.max(this.container.scale.x + ev.deltaY / 150, 0.5))
            );
            this.container.x -= (this.container.height - lastHeight) / 2;
            this.container.y -= (this.container.width - lastWidth) / 2;
            this.lastEventTime = Date.now();
        });

    }

    private ddx: number = 0;
    private ddy: number = 0;

    private smoothScale = 0.05;

    public followPlayer(lastDescriptor: PlayerDescriptor, newDescriptor: PlayerDescriptor) {
        let dx = lastDescriptor.x - newDescriptor.x;
        let dy = lastDescriptor.y - newDescriptor.y;

        this.ddx += dx;
        this.ddy += dy;

        this.container.x += this.smoothScale * this.ddx * this.container.scale.x;
        this.container.y += this.smoothScale * this.ddy * this.container.scale.y;

        if (Math.abs(this.ddx) < 0.1) {
            this.container.x += this.ddx;
        }

        if (Math.abs(this.ddy) < 0.1) {
            this.container.y += this.ddy;
        }

        this.ddx *= (1 - this.smoothScale);
        this.ddy *= (1 - this.smoothScale);

        if (Date.now() - this.lastEventTime > 5_000) {
            this.translateCamera(newDescriptor);
        }
    }

    private translateCamera(newDescriptor: PlayerDescriptor) {

        let player = this.container.toLocal(
            this.container.toGlobal({
                x: newDescriptor.x,
                y: newDescriptor.y
            } as IPointData)
        );

        let center = this.container.toLocal({
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2
            }
        );

        this.ddx += (center.x - player.x);
        this.ddy += (center.y - player.y);

        this.lastEventTime = Date.now();
    }

}