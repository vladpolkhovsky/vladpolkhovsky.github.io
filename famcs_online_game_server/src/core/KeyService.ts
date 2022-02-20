export interface KeyPressed {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean
}

export class KeyService {

    private idToKeys: Map<number, KeyPressed> = new Map<number, KeyPressed>();

    public constructor() {

    }

    public get(id: number): KeyPressed {
        let keyPressed: KeyPressed = this.idToKeys.get(id);
        if (keyPressed === undefined) {
            keyPressed = {
                w: false,
                a: false,
                s: false,
                d: false
            } as KeyPressed;
            this.idToKeys.set(id, keyPressed);
        }
        return keyPressed;
    }

    public regKeyDown(socketId: number, key: string) {
        this.get(socketId)[key] = true;
    }

    public regKeyUp(socketId: number, key: string) {
        this.get(socketId)[key] = false;
    }

    public processDisconnect(socketId: number): void {
        this.idToKeys.delete(socketId);
    }
}