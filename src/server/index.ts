import * as express from "express";

import Database from "../database";
import Event from "../event";
import chart from "./chart";

export default function(db: Database, port: number) {
    const app = express();

    app.get("/", async (req, res) => {
        const events = db.listEvents().map(Event.fromRecord);
        const chartData = chart(events);
        const rawChartData = chartData.replace(/^data:image\/png;base64,/, "");
        const img = new Buffer(rawChartData, "base64");

        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": img.length,
        });
        res.end(img);
    });

    app.listen(port, () => {
        console.log(`Server started (http://localhost:${port})`);
    });
}
