import Device from "./device";
import Event, * as event from "./event";

const e = (type: event.types, a: number, d: number) => {
    const ds = [
        `{"id": "abc", "name": "d1"}`,
        `{"id": "def", "name": "d2"}`,
        `{"id": "ghi", "name": "d3"}`,
    ];
    return Event.fromRecord({
        id: "" + Math.random(),
        time: new Date().getTime() + a * 60 * 1000,
        type,
        data: ds[d],
    });
};

const eadd = (a, d) => e(event.types.ADDED, a, d);
const erem = (a, d) => e(event.types.REMOVED, a, d);

export default [
    eadd(0, 0),
    eadd(0, 1),
    eadd(0, 2),
    erem(1, 2),
    eadd(2, 2),
    erem(5, 0),
    erem(10, 1),
    erem(10 * 24 * 60, 2),
];
