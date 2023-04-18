import {OAuth2Client} from 'google-auth-library'
import { Player } from './player';


export class AccountManager{
    client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    team1Count:number = 0;
    team2Count:number = 0;
    users:Array<Player> = [];

    async handleGoogleLogin(token){
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        })
        const {name, email, picture} = ticket.getPayload();
        if(!this.getUser(email)){
            let newUser;
            if(this.team1Count > this.team2Count){
                newUser = new Player("2",name,new Date(), email)
                this.team2Count++;
            }
            else{
                newUser = new Player("1",name,new Date(), email)
                this.team1Count++;
            }
            this.users.push(newUser)
        }
        return [name, email, picture]
    }

    getUser(email:string):Player{
        return this.users.find((user) => user.email === email)
    }
}
