import { Board, Tile } from './game-state';
let gameBoard = new Board(6, 6, ()=>{})
gameBoard.makeInitialMove(0, 0, "1");
gameBoard.makeInitialMove(0, 3, "2");
let lastMove = {row: -1, col:-1, team:-1}

function move(r,c,t,sr,sc){
    gameBoard.makeMove(r, c, t,gameBoard.tileStates[sr][sc])
    lastMove = {row: r, col:c, team:t}
}
function continueLastMove(r,c){
    move(r,c,lastMove.team, lastMove.row, lastMove.col)
    lastMove.row = r
    lastMove.col = c
}

move(0,1,1,0,0)
continueLastMove(0,2)
continueLastMove(1,2)
continueLastMove(2,2)
continueLastMove(2,1)
console.log(gameBoard.toString());


move(0,2,2,0,3)
// continueLastMove(2,0)
// continueLastMove(1,0)
// continueLastMove(0,0)
console.log(gameBoard.toString());
move(0,1,1,0,0)
continueLastMove(0,2)
continueLastMove(1,2)
// move(3,0,1,2,0)
// continueLastMove(3,1)
// continueLastMove(2,1)
console.log(gameBoard.toString());