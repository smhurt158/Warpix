import { AccountManager } from "./accounts-manager";
import { Board, Tile } from "./game-state"
import { Player } from "./player"

export type HandleClientUpdate = (gameState:Array<Array<Tile>>) => void

export class Controller{
    updateClients:HandleClientUpdate;
    gameBoard:Board;
    accountManager:AccountManager;

    constructor(updateClients:HandleClientUpdate){
      this.updateClients = updateClients;
      this.gameBoard = new Board(7, 7, updateClients);
      this.accountManager = new AccountManager();
    }

    makeGameMove(username:string, row:number, column:number, srow:number, scolumn:number){
        const user:Player = this.accountManager.getUser(username);
        if(!user || !user.team){
            console.log("username:",username)
            console.log("Users:",this.accountManager.users)
            console.log("get result:",this.accountManager.getUser(username))
            return [false, "User not found"]
        }
        const moveCheck:boolean = this.gameBoard.makeMove(row, column, user.team, this.gameBoard.tileStates[srow][scolumn]);
        if(moveCheck){
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
}

