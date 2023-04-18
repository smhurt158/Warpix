import * as express from 'express';
import { Board, Tile } from './game-state';
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import { Player } from './player';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AccountManager } from './accounts-manager';
dotenv.config();

const am = new AccountManager();

const [width, height] = [7, 7]

const webSocketConnections:Array<WebSocket> = [];


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server})
app.use(express.json())
app.use(cors())
let gameBoard = new Board(width, height, () =>{
    for(let i = 0; i < webSocketConnections.length; i++){
        webSocketConnections[i].send(JSON.stringify({
            type:"change"
        }))
    }
})


app.get('/state', (req, res) => {
    res.send(gameBoard.tileStates);
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
            if(!gameBoard.makeMove(data.row, data.col, user.team, gameBoard.tileStates[data.srow][data.scol])){
            }
        }
    });
})
server.listen(5000, () => console.log('Server running on 5000'));
