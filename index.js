const request = require("request-promise");

const devices = async () => {
    const response = await request({
        method: "POST",
        uri: "http://192.168.1.1/JNAP/",
        headers: {
            "X-JNAP-Action": "http://linksys.com/jnap/core/Transaction",
        },
        body: [{
            action: "http://linksys.com/jnap/devicelist/GetDevices",
            request: {},
        }],
        json: true,
    });

    const pattern = /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/g;

    return response.responses[0].output.devices
        // remove non-connected devices
        .filter(({connections}) => {
            return !!connections.length;
        })
        // remove noise
        .filter(({friendlyName}) => {
            return !friendlyName.match(pattern);
        })
        // remove the router
        .filter(({model}) => {
            if (!model || !model.description) {
                return true;
            }
            return !model.description.match(/router/ig);
        })
        // remove extra info
        .map(({deviceID, friendlyName}) => {
            return {
                id: deviceID,
                name: friendlyName,
            };
        });
};

const check = async (callback, previous = {}) => {
    const list = await devices();

    const current = {};
    list.forEach((device) => {
        current[device.id] = device;
    });

    const ids = Object.keys(
        Object.keys(Object.assign({}, previous, current))
            .reduce((obj, key) => {
                obj[key] = 1;
                return obj;
            }, {})
    );

    ids.forEach((id) => {
        const p = previous[id];
        const c = current[id];

        if (!!p === !!c) {
            return;
        }

        const time = Date.now();
        let type;
        let payload;
        if (!!p) {
           type = "removed";
           payload= p;
        } else {
           type = "added";
           payload= c;
        }
        callback({time, type, payload});
    });

    return current;
};

const loop = async (callback, interval = 2000) => {
    let state = {};
    while (true) {
        state = await check(callback, state);
        await new Promise((res) => setTimeout(res, interval));
    }
};

loop(console.log, 2000);
