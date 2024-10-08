
export type HandleBoardChange = (tileStates:Array<Array<Tile>>) => void;
export type HandleWinner = (winner:string) => void;

export class Board{
    width: number;
    height: number;
    //state: Array<Tile>;
    tileStates: Array<Array<Tile>>
    handleChange:Function
    handleWinner:HandleWinner
    winner:string
    constructor(width: number, height: number, handleChange:HandleBoardChange = ()=>{}, handleWinner:HandleWinner = ()=>{}){
        this.width = width;
        this.height = height;
        this.handleChange = handleChange;
        //this.state = [];
        this.initializeBoard();
        this.winner = "0"
        this.handleWinner = handleWinner
    }

    checkWinner(){
        let one = 0;
        let two = 0;
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                if(this.tileStates[i][j].team == "1") one++;
                if(this.tileStates[i][j].team == "2") two++;
            }
        }
        if(one == 0 || two / (this.width * this.height) >= .6){
            this.winner = "2"
            this.handleWinner("2");
            return
        }
        if(two == 0 || one / (this.width * this.height) >= .6){
            this.winner = "1"
            this.handleWinner("1");
            return
        }
    }
    makeInitialMove(row:number, col:number, team: string){
        const t:Tile = new Tile(row, col, team)
        //this.state.push(t)
        this.tileStates[row][col] = t
    }
    clearBoard(){
        this.tileStates = [];
        for(let i = 0; i < this.height; i ++){
            this.tileStates.push(new Array<Tile>())
            for(let j = 0; j < this.width; j ++){
                let t = new Tile(i, j, "0")
                this.tileStates[i].push(t)
            }
        }
        this.handleChange(this.tileStates);
        this.checkWinner()
    }
    initializeBoard(){
        this.winner = "0";
        this.tileStates = [];
        for(let i = 0; i < this.height; i ++){
            this.tileStates.push(new Array<Tile>())
            for(let j = 0; j < this.width; j ++){
                let t = new Tile(i, j, "0")
                this.tileStates[i].push(t)
            }
        }
        this.makeInitialMove(Math.floor(this.height/2), Math.floor(this.width/4), "1")
        this.makeInitialMove(Math.floor(this.height/2), this.width - Math.ceil(this.width/4), "2")
        this.handleChange(this.tileStates);

    }

    checkMove(row:number, column:number, team: string, source: Tile){
        //Valid Tiles
        if(row >= this.height || column >= this.width || row < 0 || column < 0){
            console.log("dest");
            return false
        }
        if(source.row >= this.height || source.column >= this.width || source.row < 0 || source.column < 0){
            console.log("source");
            return false;
        }

        //Tiles 1 space away
        const diff = source.row - row + source.column - column
        const product = (source.row - row) * (source.column - column)
        if((diff != 1 && diff != -1) || product != 0) {console.log("distance");return false}

        //not source's previous
        if(source.hasTrail && source.trail.previous[0] == row && source.trail.previous[1] == column){
            return false;
        }

        //coming from team's square/starting trail
        if(source.team == team){
            return true;
        }

        //continuing trail
        if(!source.hasTrail){
            return false;
        }
        if(source.trail.team != team){
            return false;
        }
        if(!source.trail.head){
            return false;
        }
        return true
    }
    makeMove(row:number, col:number, team: string, source: Tile){
        if(!this.checkMove(row, col, team, source)){
            return false;
        }
        const destination:Tile = this.tileStates[row][col]
        if(destination.hasTrail){
            const deletedSource:boolean = this.destroyTrail(destination.trail, source)
            if(deletedSource){
                this.handleChange(this.tileStates);
                this.checkWinner()

                return true
            }
        }
        if(destination.team != team){
            let trail:Trail = new Trail(team, source, destination)
            if(source.team == team){
                source.sourcesTrail =true;
                source.trailSourced = trail;
            }
            destination.hasTrail = true
            destination.trail = trail
            this.tileStates.forEach(tile =>{
                //console.log(tile)
            })
            this.handleChange(this.tileStates);
            this.checkWinner()

            return true
        }
        else if(destination.team == team){
            let currTile = source
            while(currTile.hasTrail){
                //console.log(currTile)
                if(currTile.sourcesTrail && currTile.team != team){
                    this.destroyTrail(currTile.trailSourced, null);
                }
                currTile.team = team
                this.completeTrail(currTile)
                currTile = currTile.trail.getPreviousTile(this.tileStates)
            }
            if(source.hasTrail){
                this.destroyTrail(source.trail, null)
            }
        }
        this.handleChange(this.tileStates);
        this.checkWinner()

        return true
        //this.state.push(t)
    }
    

    // removes entire trail and returns true if source was in the trail
    destroyTrail(trail:Trail, source:Tile){
        let containsSource:boolean = false;
        let btile:Tile = trail.getPreviousTile(this.tileStates)
        while(btile.hasTrail && btile.trail.team == trail.team){
            if(btile == source){
                containsSource = true;
            }

            const a = btile
            btile = btile.trail.getPreviousTile(this.tileStates)

            a.trail.destroy(this.tileStates)      
        }
        if(btile.sourcesTrail){
            btile.sourcesTrail = false;
            btile.trailSourced = null;
        }

        let ftrail:Trail = trail.next
        while(ftrail != undefined){
            if(source && ftrail.tile[0] == source.row && ftrail.tile[1] == source.column){
                containsSource = true;
            }

            const a = ftrail
            ftrail = ftrail.next

            a.destroy(this.tileStates)

        }
        trail.destroy(this.tileStates)
        return containsSource
    }

    completeTrail(destination:Tile){
        let row = destination.row;
        let col = destination.column;
        if(row < this.height - 1 && !this.isNextOrPrevious(destination, row + 1, col))   this.floodFill(row + 1, col, destination.team)
        if(row > 0 && !this.isNextOrPrevious(destination, row - 1, col))                 this.floodFill(row - 1, col, destination.team)
        if(col < this.width - 1 && !this.isNextOrPrevious(destination, row, col + 1))    this.floodFill(row, col + 1, destination.team)
        if(col > 0 && !this.isNextOrPrevious(destination, row, col - 1))                 this.floodFill(row, col - 1, destination.team)
    }

    isNextOrPrevious(t:Tile, rowToCheck:number, colToCheck:number){
        if(!t.hasTrail) return false;
        let prevTile:Array<number> = t.trail.previous;
        if(prevTile[0] == rowToCheck && prevTile[1] == colToCheck){
            return true;
        }
        if(t.trail.head) return false;
        let nextTile:Array<number> = t.trail.next.tile;
        if(nextTile[0] == rowToCheck && nextTile[1] == colToCheck){
            return true;
        }
        return false
    }

    floodFill(row:number, col:number, team:string){
        if(this.tileStates[row][col].team == team){
            return;
        }
        let checked:Array<Tile> = [];
        let stack:Array<Tile> = [];

        stack.push(this.tileStates[row][col])
        let inside:boolean = true;
        while (stack.length != 0){

            const b = stack.pop()
            let currentTile:Tile = b
            if(currentTile.team == team){
                continue
            }
            
            if(currentTile.row == 0 || currentTile.column == 0 || currentTile.row == this.height - 1 || currentTile.column == this.width - 1){
                inside = false
                break
            }
            checked.push(currentTile);
            if(!checked.includes(this.tileStates[currentTile.row + 1][currentTile.column])) {
                stack.push(this.tileStates[currentTile.row + 1][currentTile.column])
            }
            if(!checked.includes(this.tileStates[currentTile.row - 1][currentTile.column])) {
                stack.push(this.tileStates[currentTile.row - 1][currentTile.column])
            }
            if(!checked.includes(this.tileStates[currentTile.row][currentTile.column + 1])) {

                stack.push(this.tileStates[currentTile.row][currentTile.column + 1])
            }
            if(!checked.includes(this.tileStates[currentTile.row][currentTile.column - 1])) {

                stack.push(this.tileStates[currentTile.row][currentTile.column - 1])
            }

        }
        if(inside){
            checked.forEach(tile =>{
                if(tile.hasTrail){
                    this.destroyTrail(tile.trail, null)
                }
                tile.team = team;
            })
        }

    }


    toString(){
        let output = ""
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                const tile:Tile = this.tileStates[i][j]
                if(tile){
                    output += tile.team;
                    if(tile.hasTrail){
                        output += tile.trail.team
                    }
                    else{
                        output += '0'
                    }
                }
                else output += '00'
                output += "  "
            }
            output += '\n'
        }
        return output
    }
}

export class Tile{
    row:number;
    column:number;
    team: string;
    hasTrail:boolean;
    trail:Trail;
    sourcesTrail:boolean;
    trailSourced:Trail;
    constructor(row: number,col: number, team:string){
        this.row = row;
        this.column = col;
        this.team = team;
        this.hasTrail = false;
        this.sourcesTrail = false;
    }
}



export class Trail{
    head:boolean
    previous:Array<number>
    next:Trail
    tile:Array<number>
    team:string
    constructor(team:string, sourceTile:Tile, tile:Tile){
        this.head = true;

        this.team = team;

        this.previous = [sourceTile.row, sourceTile.column];
        if(sourceTile.hasTrail && sourceTile.trail.team == this.team){
            sourceTile.trail.next = this
            sourceTile.trail.head = false;
        }

        this.tile = [tile.row, tile.column];
    }
    getTile(tileStates: Array<Array<Tile>>){
        return tileStates[this.tile[0]][this.tile[1]]
    }
    getPreviousTile(tileStates: Array<Array<Tile>>){
        return tileStates[this.previous[0]][this.previous[1]]
    }
    destroy(tileStates: Array<Array<Tile>>){

        this.getTile(tileStates).hasTrail = false
        this.getTile(tileStates).trail = undefined

        this.previous = undefined
        this.next = undefined
        this.tile = undefined
            
        
    }
}


