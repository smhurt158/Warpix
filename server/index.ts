import * as express from 'express';
import { Board, Tile } from './game-state';
const app = express();
app.use(express.json())
let gameBoard = new Board(5, 5)

gameBoard.makeInitialMove(0, 0, "1")
gameBoard.makeInitialMove(0, 3, "2")


app.get('/', (req, res) => {
    console.log(gameBoard.toString())
    res.send(gameBoard.toString());
});

app.post('/move', (req, res) => {
    const body = req.body
    gameBoard.makeMove(body.row, body.col, body.team, gameBoard.tileStates[body.srow][body.scol])
    res.send(gameBoard.toString());
});


app.listen(5000, () => console.log('Server running'));
