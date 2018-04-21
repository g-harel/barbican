import Database from "./database";
import monitor from "./monitor";
import server from "./server";

const serverPort = 4321;

const db = new Database();

monitor(db);
server(db, serverPort);
