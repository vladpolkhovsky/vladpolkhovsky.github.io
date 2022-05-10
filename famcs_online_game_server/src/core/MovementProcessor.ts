import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";
import {KeyPressed, KeyService} from "./KeyService";
import {MapService} from "../map/MapService";
import {BorderDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/BorderDescriptor";
import {PlayerState} from "./PlayerState";

export class MovementProcessor {

    private idToPosition: Map<number, PositionDescriptor> = new Map<number, PositionDescriptor>();

    private idToBonus: Map<number, number> = new Map<number, number>();

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
            x: Math.random() * this.mapService.getTilesDescriptors()[0].length * MapService.tileLength,
            y: Math.random() * this.mapService.getTilesDescriptors().length * MapService.tileLength,
            id: id
        } as PositionDescriptor;

        this.idToPosition.set(id, pd);

        return pd;
    }

    private sqr(v: number): number {
        return v * v;
    }

    private getLenFromCenter(pd: PositionDescriptor, border: BorderDescriptor): number {
        return Math.sqrt(this.sqr(pd.x - border.x) + this.sqr(pd.y - border.y));
    }

    public tick(dt: number, idToPlayerState: Map<number, PlayerState>, border: BorderDescriptor): void {

        let toDelete: Array<number> = [];

        this.idToBonus.forEach((value, key) => {
            if (value < 0) {
                toDelete.push(key);
            }
        });

        toDelete.forEach((x) => {
            this.idToBonus.delete(x)
        });

        this.idToPosition.forEach((positionDescriptor, id) => {
            let keyPressed = this.keyService.get(id);

            let isTarget = idToPlayerState.get(id).type === "target";
            idToPlayerState.get(id).ignoreTicks -= dt;

            let vector: [number, number] = MovementProcessor.getMoveVector(keyPressed);

            let dx = vector[0] * MovementProcessor.DEFAULT_SPEED * dt;
            let dy = vector[1] * MovementProcessor.DEFAULT_SPEED * dt;

            if (isTarget) {
                dx *= 1.15;
                dy *= 1.15;
            }

            let bonus = this.idToBonus.get(id);
            if (bonus !== undefined) {
                dx *= 1.45
                dy *= 1.45
                this.idToBonus.set(id, bonus - dt);
            }

            let newPositionDescriptor: PositionDescriptor = {
                x: positionDescriptor.x + dx,
                y: positionDescriptor.y + dy
            } as PositionDescriptor;

            let vLen = this.getLenFromCenter(newPositionDescriptor, border);

            if (vLen >= border.r) {
                let x = newPositionDescriptor.x - border.x;
                let y = newPositionDescriptor.y - border.y;
                x /= vLen;
                y /= vLen;
                newPositionDescriptor.x = border.x + x * border.r;
                newPositionDescriptor.y = border.y + y * border.r;
            }

            if (isTarget) {
                let changed = false;
                idToPlayerState.forEach((value, key) => {
                    if (changed || id === value.id || value.ignoreTicks >= 0) {
                        return;
                    }
                    if (this.sqr(value.playerPosition.x - positionDescriptor.x) + this.sqr(value.playerPosition.y - positionDescriptor.y) <= 32 * 32) {
                        idToPlayerState.get(id).type = "common";
                        idToPlayerState.get(id).ignoreTicks = 5;
                        idToPlayerState.get(value.id).type = "target";
                        changed = true;
                    }
                });
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

    private readonly BONUS_TIME = 5;

    public addSpeedBonus(pkey: number) {
        let speedBonus = this.idToBonus.get(pkey);
        if (speedBonus === undefined || isNaN(speedBonus)) {
            speedBonus = 0;
        }
        this.idToBonus.set(pkey, speedBonus * 0.7 + this.BONUS_TIME);
    }
}