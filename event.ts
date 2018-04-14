import * as uuid from 'uuid/v1';

export enum types {
    ADDED      = 'ADDED',
    REMOVED    = 'REMOVED',
    DISCONNECT = 'DISCONNECT',
    RECONNECT  = 'RECONNECT',
}

export type consumer = (e: Event) => void

export type record = {
    id:   string,
    type: string,
    time: number,
    data: string,
}

export default class Event {
    private id: string;
    private type: types;
    private time: number;
    private data: any;

    protected constructor(type: types, data: any) {
        this.id = uuid();
        this.type = type;
        this.time = Date.now();
        this.data = data;
    }

    public static fromRecord(r: record): Event {
        const e = new Event(types[r.type], JSON.parse(r.data));
        e.id = r.id;
        e.time = r.time;
        return e;
    }

    public serialize(): [string, string, number, string] {
        let data = this.data;
        if (data === undefined || data === null) {
            data = '';
        }
        data = JSON.stringify(data);

        return [this.id, types[this.type], this.time, data];
    }

    public getID(): string {
        return this.id;
    }

    public getType(): types {
        return this.type;
    }

    public getTime(): Date {
        return new Date(this.time);
    }

    public getData(): any {
        return this.data;
    }
}

export class Added extends Event {
    constructor(data: any) {
        super(types.ADDED, data);
    }
}

export class Removed extends Event {
    constructor(data: any) {
        super(types.REMOVED, data);
    }
}

export class Disconnect extends Event {
    constructor(data: any) {
        super(types.DISCONNECT, data);
    }
}

export class Reconnect extends Event {
    constructor(data: any) {
        super(types.RECONNECT, data);
    }
}
