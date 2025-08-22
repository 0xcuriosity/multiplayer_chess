"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const game_manager = new GameManager_1.GameManager();
wss.on("connection", function connection(ws) {
    console.log("connection");
    game_manager.add_user(ws);
    ws.on("close", () => {
        game_manager.remove_user(ws);
    });
});
