import * as express from 'express';
import { Board, Tile } from './game-state';
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import {OAuth2Client} from 'google-auth-library'
import { Player } from './player';
import * as http from 'http';
import * as WebSocket from 'ws';
dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const [width, height] = [6, 6]
const users:Array<Player> = [
    {
        email: "hurt3335@gmail.com",
        name: "Sean Hurt",
        team: "2",
        lastMove: new Date()
    },
    {
        email: "lordoftheseans@gmail.com",
        name: "Sean Hurt",
        team: "1",
        lastMove: new Date()
    },
];
const webSocketConnections:Array<WebSocket> = [];
function upsert(array:Array<Player>, player:Player){
    const i = array.findIndex((_item) => _item.email === player.email);
    if (i < 0) array.push(player)
}

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

    const i = users.findIndex((_item) => _item.email === body.player.email);
    if (i < 0) {
        res.status(400).send('user not found');
        return;
    }
    //console.log(users[i])
    if(!gameBoard.makeMove(body.row, body.col, users[i].team, gameBoard.tileStates[body.srow][body.scol])){
        res.status(400).send('Illegal Move');
        return;
    }
    
    res.send(gameBoard.tileStates);
});

app.post('/google-login', async (req, res) => {
    //console.log("player added")
    const {token} = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    })
    const {name, email, picture} = ticket.getPayload();
    upsert(users, new Player("1", name, new Date(0), email))
    res.status(201);
    res.json({name, email, picture})
});

wss.on('connection', (ws:WebSocket)=>{
    console.log("ws connected")
    webSocketConnections.push(ws)
    ws.on('message', (message:string)=>{
        let data = JSON.parse(message)
        console.log(data)
        if(data.type == "move"){
            const i = users.findIndex((_item) => _item.email === data.player.email);
            if(!gameBoard.makeMove(data.row, data.col, users[i].team, gameBoard.tileStates[data.srow][data.scol])){
                console.log("invalid")
            }
        }
    });
    ws.on('close',()=>{
        console.log("closing")
    })
})
server.listen(5000, () => console.log('Server running'));
