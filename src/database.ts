import * as SqliteDatabase from "better-sqlite3";

import Event, * as event from "./event";

const dbname = "barbican";

export default class Database {
    private db: SqliteDatabase;

    constructor() {
        this.db = new SqliteDatabase(dbname + ".db");
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS events (
                id   TEXT   NOT NULL,
                type TEXT   NOT NULL,
                time BIGINT NOT NULL,
                data TEXT   NOT NULL
            );
        `);
    }

    public insertEvent(e: Event) {
        this.db.prepare("INSERT INTO events (id, type, time, data) VALUES (?, ?, ?, ?)").run(e.serialize());
    }

    public listEvents(since: number = 0): event.Record[] {
        return this.db.prepare("SELECT * FROM events WHERE time > ? ORDER BY time ASC").all(since);
    }
}
