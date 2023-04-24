import {OAuth2Client} from 'google-auth-library'
import { Player } from './player';


export class AccountManager{
    team1Count:number = 0;
    team2Count:number = 0;
    users:Array<Player> = [];

    
    addUser(username:string){
        if(!this.getUser(username)){
            let newUser;
            if(this.team1Count > this.team2Count){
                newUser = new Player("2", new Date(), username)
                this.team2Count++;
            }
            else{
                newUser = new Player("1", new Date(), username)
                this.team1Count++;
            }
            this.users.push(newUser)
        }
    }

    getUser(username:string):Player{
        return this.users.find((user) => user.username === username)
    }
}
