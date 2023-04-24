"use strict";
exports.__esModule = true;
exports.AccountManager = void 0;
var player_1 = require("./player");
var AccountManager = /** @class */ (function () {
    function AccountManager() {
        this.team1Count = 0;
        this.team2Count = 0;
        this.users = [];
    }
    AccountManager.prototype.addUser = function (username) {
        if (!this.getUser(username)) {
            var newUser = void 0;
            if (this.team1Count > this.team2Count) {
                newUser = new player_1.Player("2", new Date(), username);
                this.team2Count++;
            }
            else {
                newUser = new player_1.Player("1", new Date(), username);
                this.team1Count++;
            }
            this.users.push(newUser);
        }
    };
    AccountManager.prototype.getUser = function (username) {
        return this.users.find(function (user) { return user.username === username; });
    };
    return AccountManager;
}());
exports.AccountManager = AccountManager;
