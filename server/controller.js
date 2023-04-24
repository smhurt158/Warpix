"use strict";
exports.__esModule = true;
exports.Controller = void 0;
var accounts_manager_1 = require("./accounts-manager");
var game_state_1 = require("./game-state");
var Controller = /** @class */ (function () {
    function Controller(updateClients) {
        this.updateClients = updateClients;
        this.gameBoard = new game_state_1.Board(7, 7, updateClients);
        this.accountManager = new accounts_manager_1.AccountManager();
    }
    Controller.prototype.makeGameMove = function (username, row, column, srow, scolumn) {
        var user = this.accountManager.getUser(username);
        if (!user || !user.team) {
            console.log("username:", username);
            console.log("Users:", this.accountManager.users);
            console.log("get result:", this.accountManager.getUser(username));
            return [false, "User not found"];
        }
        var moveCheck = this.gameBoard.makeMove(row, column, user.team, this.gameBoard.tileStates[srow][scolumn]);
        if (moveCheck) {
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
    return Controller;
}());
exports.Controller = Controller;
