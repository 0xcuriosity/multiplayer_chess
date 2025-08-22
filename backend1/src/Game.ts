import WebSocket from "ws";
import { Chess } from "chess.js";
import { Message } from "./messages";

export class Game {
  private player1: WebSocket;
  private player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
  }

  getPlayer1() {
    return this.player1;
  }
  getPlayer2() {
    return this.player2;
  }
  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // validation here - is it this user's move (validate the type of move using zod)
    // is this move valid
    if (
      (this.board.moves.length % 2 === 0 && socket !== this.player1) ||
      (this.board.moves.length % 2 === 0 && socket !== this.player1)
    ) {
      console.error("Not your turn");
      socket.send("Not your turn");
      return;
    }
    try {
      this.board.move(move);
    } catch (error) {
      console.error(error);
      console.error("Send a valid move");
      socket.send("Send a valid move");
    }
    // check if the game is over
    if (this.board.isGameOver()) {
      const game_over_message = JSON.stringify({
        message: Message.GAME_OVER,
        player: this.board.turn() === "w" ? "Black" : "White",
      });
      this.player1.emit(game_over_message);
      this.player2.emit(game_over_message);
      return;
    }
    if (this.board.moves.length % 2 === 0) {
      this.player2.emit(
        JSON.stringify({
          type: Message.MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.emit(
        JSON.stringify({
          type: Message.MOVE,
          payload: move,
        })
      );
    }

    // send the updated board to both the players
  }
}
