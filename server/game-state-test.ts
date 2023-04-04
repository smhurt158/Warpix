import { Board, Tile } from './game-state';
let gameBoard = new Board(6, 6)

gameBoard.makeInitialMove(0, 0, "1")
gameBoard.makeInitialMove(0, 3, "2")

console.log(gameBoard.toString())