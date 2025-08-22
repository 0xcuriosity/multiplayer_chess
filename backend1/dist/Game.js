"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.movesCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: "init_game" /* Message.INIT_GAME */,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: "init_game" /* Message.INIT_GAME */,
            payload: {
                color: "black",
            },
        }));
    }
    getPlayer1() {
        return this.player1;
    }
    getPlayer2() {
        return this.player2;
    }
    makeMove(socket, move) {
        // validation here - is it this user's move (validate the type of move using zod)
        // is this move valid
        if ((this.movesCount % 2 === 0 && socket !== this.player1) ||
            (this.movesCount % 2 === 0 && socket !== this.player1)) {
            console.error("Not your turn");
            socket.send("Not your turn");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.error(error);
            console.error("Send a valid move");
            socket.send("Send a valid move");
        }
        // check if the game is over
        if (this.board.isGameOver()) {
            const game_over_message = JSON.stringify({
                message: "game_over" /* Message.GAME_OVER */,
                player: this.board.turn() === "w" ? "Black" : "White",
            });
            this.player1.send(game_over_message);
            this.player2.send(game_over_message);
            return;
        }
        if (this.movesCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: "move" /* Message.MOVE */,
                payload: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: "move" /* Message.MOVE */,
                payload: move,
            }));
        }
        this.movesCount++;
        // send the updated board to both the players
    }
}
exports.Game = Game;
