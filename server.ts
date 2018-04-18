import * as express from "express";

import chart from "./chart";
import Database from "./database";
import Event from "./event";
import run from "./producer";

run();

const db = new Database();

const app = express();

app.get("/", async (req, res) => {
    const img = new Buffer(
        chart(db.listEvents().map(Event.fromRecord)).replace(/^data:image\/png;base64,/, ""),
        "base64");

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": img.length,
    });
    res.end(img);
});

app.listen(3210);
