import Device, * as device from "./device";
import * as event from "./event";

const check = async (fetcher: device.fetcher, callback: event.consumer, previous: device.Map = {}) => {
    const list = await fetcher();

    const current: device.Map = {};
    list.forEach((d) => {
        current[d.getID()] = d;
    });

    const ids = Object.keys(
        Object.keys({...previous, ...current}).reduce((obj, key) => {
            obj[key] = 1;
            return obj;
        }, {}),
    );

    ids.forEach((id) => {
        const prev = previous[id];
        const curr = current[id];

        if (!!prev === !!curr) {
            return;
        }
        if (!!prev) {
            return callback(new event.Removed(prev));
        }
        return callback(new event.Added(curr));
    });

    return current;
};

export default async function loop(fetcher: device.fetcher, callback: event.consumer, interval: number = 2000) {
    let state: device.Map = {};
    let errStreak = 0;
    while (true) {
        try {
            state = await check(fetcher, callback, state);
            errStreak = 0;
        } catch (e) {
            console.log("connection lost " + Date.now());
            if (errStreak === 0) {
                Object.keys(state).forEach((key) => {
                    callback(new event.Removed(state[key]));
                });
                state = {};
            }
            errStreak++;
        }
        // exponentially increasing delay up to 30 mins
        const pause = Math.min(30 * 60 * 1000, interval * (1 + errStreak ** 1.5));
        await new Promise((res) => setTimeout(res, pause));
    }
}
