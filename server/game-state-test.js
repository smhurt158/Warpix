"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_state_1 = require("./game-state");
var gameBoard = new game_state_1.Board(6, 6, function () { });
gameBoard.makeInitialMove(0, 0, "1");
gameBoard.makeInitialMove(0, 3, "2");
var lastMove = { row: -1, col: -1, team: -1, gb: null };
function move(gb, r, c, t, sr, sc) {
    gb.makeMove(r, c, t, gb.tileStates[sr][sc]);
    lastMove = { row: r, col: c, team: t, gb: gb };
}
function continueLastMove(r, c) {
    move(lastMove.gb, r, c, lastMove.team, lastMove.row, lastMove.col);
    lastMove.row = r;
    lastMove.col = c;
}
function checkTile(tile, team, hasTrail, trailHead, trailTile, trailTeam) {
    if (trailHead === void 0) { trailHead = null; }
    if (trailTile === void 0) { trailTile = null; }
    if (trailTeam === void 0) { trailTeam = null; }
    if (team != tile.team) {
        return false;
    }
    if (hasTrail != tile.hasTrail) {
        return false;
    }
    if (!hasTrail) {
        return true;
    }
    if (trailHead != tile.trail.head) {
        return false;
    }
    if (trailTile[0] != tile.row) {
        return false;
    }
}
function testBasicCapture() {
    var gameBoard = new game_state_1.Board(6, 6, function () { });
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(0, 0, "1");
    move(gameBoard, 0, 1, 1, 0, 0);
    continueLastMove(0, 2);
    continueLastMove(1, 2);
    continueLastMove(2, 2);
    continueLastMove(2, 1);
    continueLastMove(2, 0);
    continueLastMove(1, 0);
    continueLastMove(0, 0);
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if (i < 3 && j < 3) {
                if (!checkTile(gameBoard.tileStates[i][j], "1", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
            else {
                if (!checkTile(gameBoard.tileStates[i][j], "0", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
        }
    }
    return true;
}
function testCaptureEnemySourceBlock() {
    var gameBoard = new game_state_1.Board(6, 6, function () { });
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(2, 2, "1");
    gameBoard.makeInitialMove(2, 4, "2");
    move(gameBoard, 1, 2, 1, 2, 2);
    move(gameBoard, 2, 3, 2, 2, 4);
    continueLastMove(2, 2);
    continueLastMove(3, 2);
    continueLastMove(3, 3);
    continueLastMove(3, 4);
    continueLastMove(2, 4);
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if ([2, 3].includes(i) && [2, 3, 4].includes(j)) {
                if (!checkTile(gameBoard.tileStates[i][j], "2", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
            else {
                if (!checkTile(gameBoard.tileStates[i][j], "0", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
        }
    }
    return true;
}
function testSurroundTrail() {
    var gameBoard = new game_state_1.Board(6, 6, function () { });
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(2, 2, "1");
    move(gameBoard, 1, 2, 1, 2, 2);
    continueLastMove(1, 3);
    continueLastMove(2, 3);
    continueLastMove(2, 4);
    continueLastMove(1, 4);
    continueLastMove(0, 4);
    continueLastMove(0, 3);
    continueLastMove(0, 2);
    continueLastMove(0, 1);
    continueLastMove(1, 1);
    continueLastMove(2, 1);
    continueLastMove(2, 2);
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if ([0, 1, 2].includes(i) && [1, 2, 3, 4].includes(j)) {
                if (!checkTile(gameBoard.tileStates[i][j], "1", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
            else {
                if (!checkTile(gameBoard.tileStates[i][j], "0", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
        }
    }
    return true;
}
function testPocketCapture() {
    var gameBoard = new game_state_1.Board(6, 6, function () { });
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(0, 0, "1");
    move(gameBoard, 0, 1, 1, 0, 0);
    continueLastMove(0, 2);
    continueLastMove(0, 3);
    continueLastMove(1, 3);
    continueLastMove(2, 3);
    continueLastMove(2, 2);
    continueLastMove(2, 1);
    continueLastMove(1, 1);
    continueLastMove(1, 0);
    continueLastMove(0, 0);
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if (([0, 1].includes(i) && j == 0) || ([0, 1, 2].includes(i) && [1, 2, 3].includes(j))) {
                if (!checkTile(gameBoard.tileStates[i][j], "1", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
            else {
                if (!checkTile(gameBoard.tileStates[i][j], "0", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
        }
    }
    return true;
}
function testDestroySelf() {
    var gameBoard = new game_state_1.Board(6, 6, function () { });
    gameBoard.clearBoard();
    gameBoard.makeInitialMove(2, 2, "1");
    move(gameBoard, 2, 3, "1", 2, 2);
    continueLastMove(2, 4);
    continueLastMove(3, 4);
    continueLastMove(3, 3);
    continueLastMove(2, 3);
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if (i == 2 && j == 2) {
                if (!checkTile(gameBoard.tileStates[i][j], "1", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
            else {
                if (!checkTile(gameBoard.tileStates[i][j], "0", false)) {
                    console.log("Problem on Tile: " + i + ", " + j);
                    console.log(gameBoard.toString());
                    return false;
                }
            }
        }
    }
    return true;
}
console.log(testBasicCapture());
console.log(testDestroySelf());
console.log(testPocketCapture());
console.log(testCaptureEnemySourceBlock());
console.log(testSurroundTrail());
