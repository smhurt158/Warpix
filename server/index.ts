import * as express from 'express';
import { Board } from './game-state';
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import { Player } from './player';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AccountManager } from './accounts-manager';
import * as path from 'path';
dotenv.config();

const am = new AccountManager();


const webSocketConnections:Array<WebSocket> = [];

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, '../webpage/build')));

const server = http.createServer(app);
const wss = new WebSocket.Server({server})
app.use(express.json())
app.use(cors())
let gameBoard = new Board(7, 7, () =>{
    for(let i = 0; i < webSocketConnections.length; i++){
        webSocketConnections[i].send(JSON.stringify({
            type:"state",
            data:gameBoard.tileStates
        }))
    }
})


app.get('/state', (req, res) => {
    res.send(gameBoard.tileStates);
});
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'webpage/build', 'index.html'));
});
app.post('/reset', (req, res) => {
    gameBoard.initializeBoard();
    res.send(gameBoard.tileStates);
})

app.post('/move', (req, res) => {
    const body = req.body

    const user:Player = am.getUser(body.player.email);
    if (!user) {
        res.status(400).send('user not found');
        return;
    }
    if(!gameBoard.makeMove(body.row, body.col, user.team, gameBoard.tileStates[body.srow][body.scol])){
        res.status(400).send('Illegal Move');
        return;
    }
    
    res.send(gameBoard.tileStates);
});

app.post('/google-login', async (req, res) => {
    const {token} = req.body;
    const [name, email, picture] = await am.handleGoogleLogin(token);
    res.status(201);
    res.json({name, email, picture})
});

wss.on('connection', (ws:WebSocket)=>{
    webSocketConnections.push(ws)
    ws.on('message', (message:string)=>{
        let data = JSON.parse(message)
        if(data.type == "move"){
            const user:Player = am.getUser(data.player.email);
            if(!user || !user.team){
                console.log(user)

                ws.send(JSON.stringify({"type":"error","message":"PLAYER NOT FOUND"}))
                return
            }
            if(!data || data.row == null || data.row == undefined || data.col == null || data.col == undefined || data.srow == null || data.srow == undefined || data.scol == null || data.scol == undefined){
                ws.send(JSON.stringify({"type":"error","message":"DATA MISSING"}))
                console.log(data) 
                return
            }
            if(!gameBoard.makeMove(data.row, data.col, user.team, gameBoard.tileStates[data.srow][data.scol])){
                ws.send(JSON.stringify({"type":"error","message":"INVALID MOVE"}))
            }
        }
    });
    ws.on('close', (message:string)=>{
        console.log("Connection closed")
    });
})
server.listen(PORT, () => console.log('Server running on ', PORT));
