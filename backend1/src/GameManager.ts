import { WebSocket } from "ws";
import { Message } from "./messages";
import { Game } from "./Game";
// User
export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];
  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  add_user(socket: WebSocket) {
    this.users.push(socket);
  }
  remove_user(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    // stop the game here becuase user left
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message === Message.INIT_GAME) {
        // if there is a pending user
        if (this.pendingUser) {
          // create a game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          // now there is no pending user
          this.pendingUser = null;
        } else {
          // make the current socket connection the pending user
          this.pendingUser = socket;
        }
      }
      if (message.type === Message.MOVE) {
        const game = this.games.find(
          (game) => game.getPlayer1() === socket || game.getPlayer2() === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
