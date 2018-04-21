import * as uuid from "uuid/v1";

import Device from "./device";

export enum types {
    ADDED      = "ADDED",
    REMOVED    = "REMOVED",
}

export type consumer = (e: Event) => void;

export interface Record {
    id: string;
    type: string;
    time: number;
    data: string;
}

export default class Event {
    public static fromRecord(r: Record): Event {
        const d = JSON.parse(r.data);
        const device = new Device(d.id, d.name);
        const e = new Event(types[r.type], device);
        e.id = r.id;
        e.time = r.time;
        return e;
    }

    private id: string;
    private type: types;
    private time: number;
    private device: any;

    protected constructor(type: types, device: Device) {
        this.id = uuid();
        this.type = type;
        this.time = Date.now();
        this.device = device;
    }

    public serialize(): [string, string, number, string] {
        return [this.id, types[this.type], this.time, JSON.stringify(this.device)];
    }

    public getID(): string {
        return this.id;
    }

    public getType(): types {
        return this.type;
    }

    public getTime(): number {
        return this.time;
    }

    public getDate(): Date {
        return new Date(this.time);
    }

    public getDevice(): any {
        return this.device;
    }
}

export class Added extends Event {
    constructor(device: Device) {
        super(types.ADDED, device);
    }
}

export class Removed extends Event {
    constructor(device: Device) {
        super(types.REMOVED, device);
    }
}
