import * as fs from "fs";

import * as Canvas from "canvas";

import Event from "./event";
import data from "./mock";

if (data.length < 1) {
    console.error("not enough events");
    process.exit(0);
}

const formattedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Group {
    id: string;
    name: string;
    events: Event[];
}

const groups: {[k: string]: Group} = {};
data.forEach((e) => {
    groups[e.getDevice().getID()] = Object.assign({
        events: [],
    }, e.getDevice());
});
data.forEach((e) => {
    groups[e.getDevice().getID()].events.push(e);
});

const groupList = Object.keys(groups).map((k) => groups[k]);
const numGroups = groupList.length;

const fontSize = 14;
const rowHeight = 2 * fontSize;

const width = 1000 + Math.random() * 42;
const height = rowHeight * numGroups + 100;

const timeStart = data[0].getTime();
const timeEnd = data[data.length - 1].getTime();
const timeDelta = timeEnd - timeStart;
const timePrecision = 24 * 60 * 60 * 1000;
const subdivisions = Math.max(timeDelta / timePrecision, 1);

const canvas = new Canvas(width, height);
const ctx = canvas.getContext("2d");

// draw background color
ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, width, height);

// draw group titles
let titleWidth = 0;
ctx.fillStyle = "#000000";
ctx.font = fontSize + "px Courrier New";
groupList.forEach((g, i) => {
    ctx.fillText(g.name, 0, i * rowHeight + rowHeight / 2 + fontSize / 2);
    titleWidth = Math.max(titleWidth, ctx.measureText(g.name).width);
});

// draw day titles
const subdivisionWidth = (width - titleWidth) / subdivisions;
const subdivisionStart = rowHeight * groupList.length;
ctx.save();
for (let i = 0; i < subdivisions; i++) {
    const xcoord = titleWidth + subdivisionWidth * i;
    ctx.translate(xcoord, subdivisionStart);
    ctx.font = fontSize / 2 + "px Courrier New";
    ctx.fillText("|", 0, 0, 200);
    ctx.translate(-fontSize / 5, 4);
    ctx.font = fontSize / 1.5 + "px Courrier New";
    ctx.rotate(Math.PI / 2);
    const date = new Date(timeStart + timePrecision * i);
    const formattedDate = formattedDays[date.getDay()] + " " +
                        date.getDate() + "/" +
                        date.getMonth() + "/" +
                        date.getFullYear();
    ctx.fillText(formattedDate, 0, 0, 200);
    ctx.restore();
    ctx.save();
}

// save file
fs.writeFileSync(
    "out.png",
    canvas.toDataURL()
        .replace(/^data:image\/png;base64,/, ""),
    "base64",
);
