import * as get from "lodash.get";
import * as request from "request-promise";

import Database from "./database";
import Device, * as device from "./device";
import Event, * as event from "./event";
import loop from "./loop";

const db = new Database();

const fetcher: device.fetcher = async () => {
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
        timeout: 2000,
    });

    const pattern = /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/g;

    return get(response, "responses[0].output.devices", [])
        // remove non-connected devices
        .filter(({ connections }) => {
            return !!connections.length;
        })
        // remove noise
        // .filter(({ friendlyName }) => {
        //     return !friendlyName.match(pattern);
        // })
        // remove the router
        .filter(({ model }) => {
            if (!model || !model.description) {
                return true;
            }
            return !model.description.match(/router/gi);
        })
        // remove extra info
        .map(({ deviceID, friendlyName }) => {
            return new Device(deviceID, friendlyName);
        });
};

const consumer = (e: Event) => {
    return db.insertEvent(e);
};

export default function() {
    loop(fetcher, consumer);
}
