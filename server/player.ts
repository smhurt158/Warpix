export class Player{
    team:string;
    name:string;
    lastMove:Date;
    email:string;
    constructor(team, name, lastMove, email){
        this.team = team;
        this.name = name;
        this.lastMove = lastMove;
        this.email = email;
    }
}