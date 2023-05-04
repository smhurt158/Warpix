"use strict";
exports.__esModule = true;
exports.Trail = exports.Tile = exports.Board = void 0;
var Board = /** @class */ (function () {
    function Board(width, height, handleChange) {
        if (handleChange === void 0) { handleChange = function () { }; }
        this.width = width;
        this.height = height;
        this.handleChange = handleChange;
        //this.state = [];
        this.initializeBoard();
    }
    Board.prototype.makeInitialMove = function (row, col, team) {
        var t = new Tile(row, col, team);
        //this.state.push(t)
        this.tileStates[row][col] = t;
    };
    Board.prototype.clearBoard = function () {
        this.tileStates = [];
        for (var i = 0; i < this.height; i++) {
            this.tileStates.push(new Array());
            for (var j = 0; j < this.width; j++) {
                var t = new Tile(i, j, "0");
                this.tileStates[i].push(t);
            }
        }
        this.handleChange(this.tileStates);
    };
    Board.prototype.initializeBoard = function () {
        this.tileStates = [];
        for (var i = 0; i < this.height; i++) {
            this.tileStates.push(new Array());
            for (var j = 0; j < this.width; j++) {
                var t = new Tile(i, j, "0");
                this.tileStates[i].push(t);
            }
        }
        this.makeInitialMove(Math.floor(this.height / 2), Math.floor(this.width / 4), "1");
        this.makeInitialMove(Math.floor(this.height / 2), this.width - Math.ceil(this.width / 4), "2");
        this.handleChange(this.tileStates);
    };
    Board.prototype.checkMove = function (row, column, team, source) {
        //Valid Tiles
        if (row >= this.height || column >= this.width || row < 0 || column < 0) {
            {
                console.log("dest");
                return false;
            }
        }
        if (source.row >= this.height || source.column >= this.width || source.row < 0 || source.column < 0) {
            {
                console.log("source");
                return false;
            }
        }
        //Tiles 1 space away
        var diff = source.row - row + source.column - column;
        var product = (source.row - row) * (source.column - column);
        if ((diff != 1 && diff != -1) || product != 0) {
            console.log("distance");
            return false;
        }
        //not source's previous
        if (source.hasTrail && source.trail.previous[0] == row && source.trail.previous[1] == column) {
            return false;
        }
        //coming from team's square/starting trail
        if (source.team == team) {
            return true;
        }
        //continuing trail
        if (!source.hasTrail) {
            return false;
        }
        if (source.trail.team != team) {
            return false;
        }
        if (!source.trail.head) {
            return false;
        }
        return true;
    };
    Board.prototype.makeMove = function (row, col, team, source) {
        if (!this.checkMove(row, col, team, source)) {
            return false;
        }
        var destination = this.tileStates[row][col];
        if (destination.hasTrail) {
            var deletedSource = this.destroyTrail(destination.trail, source);
            if (deletedSource) {
                this.handleChange(this.tileStates);
                return true;
            }
        }
        if (destination.team != team) {
            var trail = new Trail(team, source, destination);
            destination.hasTrail = true;
            destination.trail = trail;
            this.tileStates.forEach(function (tile) {
                //console.log(tile)
            });
            this.handleChange(this.tileStates);
            return true;
        }
        else if (destination.team == team) {
            var currTile = source;
            while (currTile.hasTrail) {
                currTile.team = team;
                var a = currTile;
                currTile = currTile.trail.getPreviousTile(this.tileStates);
                a.trail.destroy(this.tileStates);
            }
            this.completeTrail(destination, source);
        }
        this.handleChange(this.tileStates);
        return true;
        //this.state.push(t)
    };
    // removes entire trail and returns true if source was in the trail
    Board.prototype.destroyTrail = function (trail, source) {
        var containsSource = false;
        var btile = trail.getPreviousTile(this.tileStates);
        while (btile.hasTrail) {
            if (btile == source) {
                containsSource = true;
            }
            var a = btile;
            btile = btile.trail.getPreviousTile(this.tileStates);
            a.trail.destroy(this.tileStates);
        }
        var ftrail = trail.next;
        while (ftrail != undefined) {
            if (ftrail.tile[0] == source.row && ftrail.tile[1] == source.column) {
                containsSource = true;
            }
            var a = ftrail;
            ftrail = ftrail.next;
            a.destroy(this.tileStates);
        }
        trail.destroy(this.tileStates);
        return containsSource;
    };
    Board.prototype.completeTrail = function (destination, source) {
        var row = source.row;
        var col = source.column;
        if (row < this.height - 1)
            this.floodFill(row + 1, col, source.team);
        if (row > 0)
            this.floodFill(row - 1, col, source.team);
        if (col < this.width - 1)
            this.floodFill(row, col + 1, source.team);
        if (col > 0)
            this.floodFill(row, col - 1, source.team);
        row = destination.row;
        col = destination.column;
        if (row < this.height - 1)
            this.floodFill(row + 1, col, source.team);
        if (row > 0)
            this.floodFill(row - 1, col, source.team);
        if (col < this.width - 1)
            this.floodFill(row, col + 1, source.team);
        if (col > 0)
            this.floodFill(row, col - 1, source.team);
    };
    Board.prototype.floodFill = function (row, col, team) {
        var _this = this;
        if (this.tileStates[row][col].team == team) {
            return;
        }
        var checked = [];
        var stack = [];
        stack.push(this.tileStates[row][col]);
        var inside = true;
        while (stack.length != 0) {
            var b = stack.pop();
            var currentTile = b;
            if (currentTile.team == team) {
                continue;
            }
            if (currentTile.row == 0 || currentTile.column == 0 || currentTile.row == this.height - 1 || currentTile.column == this.width - 1) {
                inside = false;
                break;
            }
            checked.push(currentTile);
            if (!checked.includes(this.tileStates[currentTile.row + 1][currentTile.column])) {
                stack.push(this.tileStates[currentTile.row + 1][currentTile.column]);
            }
            if (!checked.includes(this.tileStates[currentTile.row - 1][currentTile.column])) {
                stack.push(this.tileStates[currentTile.row - 1][currentTile.column]);
            }
            if (!checked.includes(this.tileStates[currentTile.row][currentTile.column + 1])) {
                stack.push(this.tileStates[currentTile.row][currentTile.column + 1]);
            }
            if (!checked.includes(this.tileStates[currentTile.row][currentTile.column - 1])) {
                stack.push(this.tileStates[currentTile.row][currentTile.column - 1]);
            }
        }
        if (inside) {
            checked.forEach(function (tile) {
                if (tile.hasTrail) {
                    _this.destroyTrail(tile.trail, null);
                }
                tile.team = team;
            });
        }
    };
    Board.prototype.toString = function () {
        var output = "";
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var tile = this.tileStates[i][j];
                if (tile) {
                    output += tile.team;
                    if (tile.hasTrail) {
                        output += tile.trail.team;
                    }
                    else {
                        output += '0';
                    }
                }
                else
                    output += '00';
                output += "  ";
            }
            output += '\n';
        }
        return output;
    };
    return Board;
}());
exports.Board = Board;
var Tile = /** @class */ (function () {
    function Tile(row, col, team) {
        this.row = row;
        this.column = col;
        this.team = team;
        this.hasTrail = false;
    }
    return Tile;
}());
exports.Tile = Tile;
var Trail = /** @class */ (function () {
    function Trail(team, sourceTile, tile) {
        this.head = true;
        this.team = team;
        this.previous = [sourceTile.row, sourceTile.column];
        if (sourceTile.hasTrail) {
            sourceTile.trail.next = this;
            sourceTile.trail.head = false;
        }
        this.tile = [tile.row, tile.column];
    }
    Trail.prototype.getTile = function (tileStates) {
        return tileStates[this.tile[0]][this.tile[1]];
    };
    Trail.prototype.getPreviousTile = function (tileStates) {
        return tileStates[this.previous[0]][this.previous[1]];
    };
    Trail.prototype.destroy = function (tileStates) {
        this.getTile(tileStates).hasTrail = false;
        this.getTile(tileStates).trail = undefined;
        this.previous = undefined;
        this.next = undefined;
        this.tile = undefined;
    };
    return Trail;
}());
exports.Trail = Trail;
