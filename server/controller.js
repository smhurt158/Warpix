"use strict";
exports.__esModule = true;
exports.Controller = void 0;
var accounts_manager_1 = require("./accounts-manager");
var game_state_1 = require("./game-state");
var Controller = /** @class */ (function () {
    function Controller(updateClients, handlewin) {
        this.handleWin = handlewin;
        this.updateClients = updateClients;
        this.gameBoard = new game_state_1.Board(20, 10, updateClients, this.handleWin);
        this.accountManager = new accounts_manager_1.AccountManager();
    }
    Controller.prototype.makeGameMove = function (username, row, column, srow, scolumn) {
        var user = this.accountManager.getUser(username);
        if (!user || !user.team) {
            return [false, "User not found"];
        }
        if (user.lastMove + 1000 * 30 > Date.now()) {
            console.log(user.lastMove);
            return [false, "Still on Cooldown"];
        }
        var moveCheck = this.gameBoard.makeMove(row, column, user.team, this.gameBoard.tileStates[srow][scolumn]);
        if (moveCheck) {
            user.lastMove = Date.now();
            return [true, ""];
        }
        return [false, "Invalid Move"];
    };
    Controller.prototype.getGameState = function () {
        return this.gameBoard.tileStates;
    };
    Controller.prototype.resetGame = function () {
        this.gameBoard.initializeBoard();
    };
    Controller.prototype.addUser = function (username) {
        this.accountManager.addUser(username);
    };
    Controller.prototype.getUser = function (username) {
        return this.accountManager.getUser(username);
    };
    return Controller;
}());
exports.Controller = Controller;
