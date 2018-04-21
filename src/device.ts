export type fetcher = () => Promise<Device[]>;

export interface Map {
    [key: string]: Device;
}

export default class Device {
    private id: string;
    private name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this .name = name;
    }

    public getID() {
        return this.id;
    }

    public getName() {
        return this.name;
    }
}
