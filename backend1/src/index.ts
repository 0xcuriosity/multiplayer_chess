import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });
const game_manager = new GameManager();
wss.on("connection", function connection(ws) {
  console.log("connection");
  game_manager.add_user(ws);
  ws.on("disconnect", () => {
    game_manager.remove_user(ws);
  });
});
