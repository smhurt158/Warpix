"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
var http = require("http");
var WebSocket = require("ws");
var path = require("path");
var controller_1 = require("./controller");
var google_auth_library_1 = require("google-auth-library");
dotenv.config();
var client = new google_auth_library_1.OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
var webSocketConnections = [];
var controller = new controller_1.Controller(function (state) { return broadcast("state", state); });
function broadcast(type, data) {
    for (var i = 0; i < webSocketConnections.length; i++) {
        webSocketConnections[i].send(JSON.stringify({
            type: type,
            data: data
        }));
    }
}
var PORT = process.env.PORT || 3001;
var app = express();
app.use(express.static(path.resolve(__dirname, '../webpage/build')));
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
app.use(express.json());
app.use(cors());
// 
function handleGoogleLogin(token) {
    return __awaiter(this, void 0, void 0, function () {
        var ticket, _a, name, email, picture;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.verifyIdToken({
                        idToken: token,
                        audience: process.env.CLIENT_ID
                    })];
                case 1:
                    ticket = _b.sent();
                    _a = ticket.getPayload(), name = _a.name, email = _a.email, picture = _a.picture;
                    return [2 /*return*/, [name, email, picture]];
            }
        });
    });
}
app.get('/state', function (req, res) {
    res.send(controller.getGameState());
});
app.get('/time', function (req, res) {
    var user = req.query.user.toString();
    console.log(user);
    console.log(controller.getUser(user).lastMove);
    res.send([controller.getUser(user).lastMove]);
});
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'webpage/build', 'index.html'));
});
app.post('/reset', function (req, res) {
    controller.resetGame();
    res.send(controller.getGameState());
});
app.post('/add-user', function (req, res) {
    console.log(req.body);
    var body = req.body;
    controller.addUser(body.user);
    var team = controller.getUser(body.user).team;
    res.send({ team: team });
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
app.post('/google-login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, name, email, picture;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = req.body.token;
                return [4 /*yield*/, handleGoogleLogin(token)];
            case 1:
                _a = _b.sent(), name = _a[0], email = _a[1], picture = _a[2];
                controller.addUser(email);
                res.status(201);
                res.json({ name: name, email: email, picture: picture });
                return [2 /*return*/];
        }
    });
}); });
wss.on('connection', function (ws) {
    webSocketConnections.push(ws);
    ws.on('message', function (message) {
        var data = JSON.parse(message);
        if (data.type == "move") {
            if (!data || data.player == null || data.player == undefined || data.player.email == null || data.player.email == undefined || data.row == null || data.row == undefined || data.col == null || data.col == undefined || data.srow == null || data.srow == undefined || data.scol == null || data.scol == undefined) {
                ws.send(JSON.stringify({ "type": "error", "message": "Invalid Request" }));
                console.log(data);
                return;
            }
            var _a = controller.makeGameMove(data.player.email, data.row, data.col, data.srow, data.scol), success = _a[0], errorMessage = _a[1];
            if (!success) {
                ws.send(JSON.stringify({ "type": "error", "message": errorMessage }));
                return;
            }
            ws.send(JSON.stringify({ type: "time", data: controller.getUser(data.player.email).lastMove }));
        }
        if (data.type == "initialize") {
            ws.send(JSON.stringify({ "type": "state", "data": controller.getGameState() }));
            if (controller.getUser(data.username)) {
                ws.send(JSON.stringify({ "type": "time", "data": controller.getUser(data.username).lastMove }));
            }
        }
    });
    ws.on('close', function () {
        console.log("Connection closed");
        var index = webSocketConnections.findIndex(function (element) {
            return element == ws;
        });
        webSocketConnections.splice(index);
    });
});
server.listen(PORT, function () { return console.log('Server running on ', PORT); });
setInterval(function () {
    broadcast("refresh-connection", "");
}, 31000);
