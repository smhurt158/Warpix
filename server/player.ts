export class Player{
    team:string;
    lastMove:number;
    username:string;
    constructor(team, lastMove, username){
        this.team = team;
        this.lastMove = lastMove;
        this.username = username;
    }
}