export type fetcher = () => Promise<Device[]>

export type map = {
    [key: string]: Device
}

export default class Device {
    private id: string;
    private name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this .name = name;
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }
}
