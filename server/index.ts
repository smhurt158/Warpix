import * as express from 'express';
import { Board, Tile } from './game-state';
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import {OAuth2Client} from 'google-auth-library'
import { Player } from './player';

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

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
function upsert(array:Array<Player>, player:Player){
    const i = array.findIndex((_item) => _item.email === player.email);
    if (i < 0) array.push(player)
}

const app = express();
app.use(express.json())
app.use(cors())
let gameBoard = new Board(6, 6)

gameBoard.makeInitialMove(0, 0, "1")
gameBoard.makeInitialMove(0, 3, "2")


app.get('/state', (req, res) => {
    res.send(gameBoard.tileStates);
});

app.post('/move', (req, res) => {
    const body = req.body
    console.log(body.player)

    const i = users.findIndex((_item) => _item.email === body.player.email);
    if (i < 0) {
        res.status(400).send('user not found');
        return;
    }
    console.log(users[i])
    
    gameBoard.makeMove(body.row, body.col, users[i].team, gameBoard.tileStates[body.srow][body.scol])
    res.send(gameBoard.tileStates);
});

app.post('/google-login', async (req, res) => {
    console.log("player added")
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


app.listen(5000, () => console.log('Server running'));
