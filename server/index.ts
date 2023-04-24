import * as express from 'express';
import { Board } from './game-state';
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import { Player } from './player';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AccountManager } from './accounts-manager';
import * as path from 'path';
import { Controller } from './controller';
import { OAuth2Client } from 'google-auth-library';
import { connect } from 'http2';
dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const webSocketConnections:Array<WebSocket> = [];

const controller:Controller = new Controller((state) => broadcast("state", state));

function broadcast(type:string, data:any) {
    for(let i = 0; i < webSocketConnections.length; i++){
        webSocketConnections[i].send(JSON.stringify({
           type,
           data
       }))
   }
}


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, '../webpage/build')));

const server = http.createServer(app);
const wss = new WebSocket.Server({server})
app.use(express.json())
app.use(cors())
// 
async function handleGoogleLogin(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    })
    const {name, email, picture} = ticket.getPayload();
    return [name, email, picture]
}

app.get('/state', (req, res) => {
    res.send(controller.getGameState());
});
app.get('/time', (req, res) => {
    let user:string = req.query.user.toString();
    console.log(user)
    console.log(controller.getUser(user).lastMove)
    res.send([controller.getUser(user).lastMove]);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'webpage/build', 'index.html'));
});


app.post('/reset', (req, res) => {
    controller.resetGame()
    res.send(controller.getGameState());
})
app.post('/add-user', (req, res) => {
    const body = req.body;
    controller.addUser(body.user)
});

// app.post('/move', (req, res) => {
//     const body = req.body

//     const user:Player = am.getUser(body.player.email);
//     if (!user) {
//         res.status(400).send('user not found');
//         return;
//     }
//     if(!gameBoard.makeMove(body.row, body.col, user.team, gameBoard.tileStates[body.srow][body.scol])){
//         res.status(400).send('Illegal Move');
//         return;
//     }
    
//     res.send(gameBoard.tileStates);
// });

app.post('/google-login', async (req, res) => {
    const {token} = req.body;
    const [name, email, picture] = await handleGoogleLogin(token);
    controller.addUser(email)
    res.status(201);
    res.json({name, email, picture})
});

wss.on('connection', (ws:WebSocket)=>{
    webSocketConnections.push(ws)
    ws.on('message', (message:string)=>{
        let data = JSON.parse(message)
        if(data.type == "move"){
            
            if(!data || data.player == null || data.player == undefined || data.player.email == null || data.player.email == undefined || data.row == null || data.row == undefined || data.col == null || data.col == undefined || data.srow == null || data.srow == undefined || data.scol == null || data.scol == undefined){
                ws.send(JSON.stringify({"type":"error","message":"Invalid Request"}))
                console.log(data) 
                return
            }
            const [success, errorMessage] = controller.makeGameMove(data.player.email, data.row, data.col, data.srow, data.scol);
            if(!success){
                ws.send(JSON.stringify({"type":"error","message":errorMessage}))
                return
            }
            ws.send(JSON.stringify({type:"time",data:controller.getUser(data.player.email).lastMove}))
        }
    });
    ws.on('close', ()=>{
        console.log("Connection closed")
    });
})


server.listen(PORT, () => console.log('Server running on ', PORT));
