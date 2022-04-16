import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {KeyPressed, KeyService} from "./KeyService";
import {MapService} from "../map/MapService";
import {BorderDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/BorderDescriptor";

export class MovementProcessor {

    private idToPosition: Map<number, PositionDescriptor> = new Map<number, PositionDescriptor>();

    private keyService: KeyService;

    private mapService: MapService;

    private static DEFAULT_SPEED = 100;

    private static direction: [string, number, number][] = [
        ["w", 0, -1],
        ["a", -1, 0],
        ["s", 0, 1],
        ["d", 1, 0]
    ];

    public constructor(keyService: KeyService, mapService: MapService) {
        this.keyService = keyService;
        this.mapService = mapService;
    }

    public processConnection(id: number): PositionDescriptor {
        console.log("MovementProcessor register " + id);

        let pd: PositionDescriptor = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            id: id
        } as PositionDescriptor;

        this.idToPosition.set(id, pd);

        return pd;
    }

    private sqr(v: number): number {
        return v * v;
    }

    private getLenFromCenter(pd: PositionDescriptor): number {
        return Math.sqrt(this.sqr(pd.x - this.mapService.getBorder().x) + this.sqr(pd.y - this.mapService.getBorder().y));
    }

    public tick(dt: number, border: BorderDescriptor): void {
        this.idToPosition.forEach((positionDescriptor, id) => {
            let keyPressed = this.keyService.get(id);
            let vector: [number, number] = MovementProcessor.getMoveVector(keyPressed);

            let newPositionDescriptor: PositionDescriptor = {
                x: positionDescriptor.x + vector[0] * MovementProcessor.DEFAULT_SPEED * dt,
                y: positionDescriptor.y + vector[1] * MovementProcessor.DEFAULT_SPEED * dt
            } as PositionDescriptor;


            let vLen = this.getLenFromCenter(newPositionDescriptor);
            if (vLen >= border.r) {
                let x = newPositionDescriptor.x - border.x;
                let y = newPositionDescriptor.y - border.y;
                x /= vLen;
                y /= vLen;
                newPositionDescriptor.x = border.x + x * border.r;
                newPositionDescriptor.y = border.y + y * border.r;
            }

            this.idToPosition.set(id, newPositionDescriptor);
        });
    }

    public getPositions(): Array<[number, PositionDescriptor]> {
        return Array.from<[number, PositionDescriptor]>(this.idToPosition.entries());
    }

    private static getMoveVector(keyPressed: KeyPressed): [number, number] {
        let vector: [number, number] = [0, 0];

        for (let i = 0; i < MovementProcessor.direction.length; i++) {
            let keyPressedElement = keyPressed[MovementProcessor.direction[i][0]];
            if (keyPressedElement) {
                vector[0] += MovementProcessor.direction[i][1];
                vector[1] += MovementProcessor.direction[i][2];
            }
        }

        if (Math.abs(Math.abs(vector[0]) + Math.abs(vector[1])) == 2) {
            vector[0] /= 1.41;
            vector[1] /= 1.41;
            return vector;
        }

        return vector;
    }

    public processDisconnect(socketId: number): void {
        this.idToPosition.delete(socketId);
        if (this.idToPosition.size === 0) {
            this.mapService.resetBorder();
        }
    }
}