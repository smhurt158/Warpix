import { Board, Tile, Trail } from './game-state';
let gameBoard = new Board(6, 6, ()=>{})

gameBoard.makeInitialMove(0, 0, "1");
gameBoard.makeInitialMove(0, 3, "2");
let lastMove = {row: -1, col:-1, team:-1, gb:null}

function move(gb, r,c,t,sr,sc){
    gb.makeMove(r, c, t,gb.tileStates[sr][sc])
    lastMove = {row: r, col:c, team:t, gb}
}
function continueLastMove(r ,c){
    move(lastMove.gb, r,c,lastMove.team, lastMove.row, lastMove.col)
    lastMove.row = r
    lastMove.col = c
}

function checkTile(tile:Tile, team:string, hasTrail:boolean,trailHead:boolean = null,trailTile:Array<number> = null,trailTeam:string = null){
    if(team != tile.team){
        return false
    }
    if(hasTrail != tile.hasTrail){
        return false
    }
    if(!hasTrail){
        return true
    }

    if(trailHead != tile.trail.head){
        return false
    }
    if(trailTile[0] != tile.row){
        return false
    }
    
}


function testBasicCapture(){
    let gameBoard = new Board(6, 6, ()=>{})
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(0, 0, "1");

    move(gameBoard,0,1,1,0,0)
    continueLastMove(0,2)
    continueLastMove(1,2)
    continueLastMove(2,2)
    continueLastMove(2,1)
    continueLastMove(2,0)
    continueLastMove(1,0)
    continueLastMove(0,0)
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
            if(i < 3 && j < 3){
                if(!checkTile(gameBoard.tileStates[i][j], "1", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }
            else{
                if(!checkTile(gameBoard.tileStates[i][j], "0", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }

        }
    }
    return true
}

function testPocketCapture() {
    let gameBoard = new Board(6, 6, ()=>{})
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(0, 0, "1");

    move(gameBoard,0,1,1,0,0)
    continueLastMove(0,2)
    continueLastMove(0,3)
    continueLastMove(1,3)
    continueLastMove(2,3)
    continueLastMove(2,2)
    continueLastMove(2,1)
    continueLastMove(1,1)
    continueLastMove(1,0)
    continueLastMove(0,0)
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
            if(i < 3 && j < 3){
                if(!checkTile(gameBoard.tileStates[i][j], "1", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }
            else{
                if(!checkTile(gameBoard.tileStates[i][j], "0", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }

        }
    }
    console.log(gameBoard.toString())

    return true
}

function testDestroySelf(){
    let gameBoard = new Board(6, 6, ()=>{})
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(2, 2, "1");
    move(gameBoard, 2, 3, "1", 2, 2)
    continueLastMove(2,4)
    continueLastMove(3,4)
    continueLastMove(3,3)
    continueLastMove(2,3)
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
            if(i == 2 && j == 2){
                if(!checkTile(gameBoard.tileStates[i][j], "1", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }
            else{
                if(!checkTile(gameBoard.tileStates[i][j], "0", false)){
                    console.log("Problem on Tile: " + i + ", " +j)
    
                    console.log(gameBoard.toString())
                    return false
                }
            }

        }
    }
    return true
}

console.log(testBasicCapture())
console.log(testDestroySelf())
console.log(testPocketCapture())