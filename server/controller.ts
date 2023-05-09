import { AccountManager } from "./accounts-manager";
import { Board, Tile } from "./game-state"
import { Player } from "./player"

export type HandleClientUpdate = (gameState:Array<Array<Tile>>) => void

export class Controller{
    updateClients:HandleClientUpdate;
    handleWin;
    gameBoard:Board;
    accountManager:AccountManager;

    constructor(updateClients:HandleClientUpdate, handlewin){
        this.handleWin = handlewin
      this.updateClients = updateClients;
      this.gameBoard = new Board(20, 10, updateClients, this.handleWin);
      this.accountManager = new AccountManager();
    }

    makeGameMove(username:string, row:number, column:number, srow:number, scolumn:number){
        const user:Player = this.accountManager.getUser(username);
        if(!user || !user.team){
            return [false, "User not found"]
        }
        if(user.lastMove + 1000 * 0 > Date.now() ){
            console.log(user.lastMove)

            return [false, "Still on Cooldown"]
        }
        const moveCheck:boolean = this.gameBoard.makeMove(row, column, user.team, this.gameBoard.tileStates[srow][scolumn]);
        if(moveCheck){
            user.lastMove = Date.now();
            return [true, ""]
        }
        return [false, "Invalid Move"]
    }

    getGameState(){
        return this.gameBoard.tileStates;
    }

    resetGame(){
        this.gameBoard.initializeBoard();
    }

    addUser(username:string){
        this.accountManager.addUser(username);
    }

    getUser(username:string){
        return this.accountManager.getUser(username);
    }

}

