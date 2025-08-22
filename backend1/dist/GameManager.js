"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
// User
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    add_user(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    remove_user(socket) {
        this.users = this.users.filter((user) => user !== socket);
        // stop the game here becuase user left
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === "init_game" /* Message.INIT_GAME */) {
                // if there is a pending user
                if (this.pendingUser) {
                    // create a game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    // now there is no pending user
                    this.pendingUser = null;
                }
                else {
                    // make the current socket connection the pending user
                    this.pendingUser = socket;
                }
            }
            if (message.type === "move" /* Message.MOVE */) {
                const game = this.games.find((game) => game.getPlayer1() === socket || game.getPlayer2() === socket);
                if (game) {
                    game.makeMove(socket, {
                        from: message.from,
                        to: message.to,
                    });
                }
            }
        });
    }
}
exports.GameManager = GameManager;
