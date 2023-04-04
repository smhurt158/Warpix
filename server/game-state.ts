
export class Board{
    width: number;
    height: number;
    //state: Array<Tile>;
    tileStates: Array<Array<Tile>>

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
        //this.state = [];
        this.tileStates = [];
        for(let i = 0; i < this.height; i ++){
            this.tileStates.push(new Array<Tile>())
            for(let j = 0; j < this.width; j ++){
                let t = new Tile(i, j, "0")
                this.tileStates[i].push(t)
            }
        }
    }

    makeInitialMove(row:number, col:number, team: string){
        const t:Tile = new Tile(row, col, team)
        //this.state.push(t)
        this.tileStates[row][col] = t
    }

    makeMove(row:number, col:number, team: string, source: Tile){
        const destination:Tile = this.tileStates[row][col]
        if(destination.hasTrail){
            const deletedSource:boolean = this.destroyTrail(destination.trail, source)
            if(deletedSource){
                return
            }
        }
        if(destination.team != team){
            let trail:Trail = new Trail(team, source, destination)
            destination.hasTrail = true
            destination.trail = trail
            this.tileStates.forEach(tile =>{
                //console.log(tile)
            })
            return
        }
        else if(destination.team == team){
            let currTile = source
            while(currTile.hasTrail){
                currTile.team = team
                let a = currTile
                currTile = currTile.trail.getPreviousTile(this.tileStates)
                a.trail.destroy(this.tileStates)
            }
            this.completeTrail(source)
        }

        //this.state.push(t)
    }
    

    // removes entire trail and returns true if source was in the trail
    destroyTrail(trail:Trail, source:Tile){
        let containsSource:boolean = false;
        let btile:Tile = trail.getPreviousTile(this.tileStates)
        while(btile.hasTrail){
            if(btile == source){
                containsSource = true;
            }

            const a = btile
            btile = btile.trail.getPreviousTile(this.tileStates)

            a.trail.destroy(this.tileStates)      
        }

        let ftrail:Trail = trail.next
        while(ftrail != undefined){
            if(ftrail.tile[0] == source.row && ftrail.tile[1] == source.column){
                containsSource = true;
            }

            const a = ftrail
            ftrail = ftrail.next

            a.destroy(this.tileStates)

        }

        return containsSource
    }

    completeTrail(source:Tile){
        let row = source.row;
        let col = source.column
        if(row < this.height - 1)   this.floodFill(row + 1, col, source.team)
        if(row > 0)                 this.floodFill(row - 1, col, source.team)
        if(col < this.width - 1)    this.floodFill(row, col + 1, source.team)
        if(col > 0)                 this.floodFill(row, col - 1, source.team)
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
            console.log("start: ")

            const b = stack.pop()
            console.log(b)
            if(!b) console.log("error")
            let currentTile:Tile = b
            if(currentTile.team == team){
                continue
            }
            
            if(currentTile.row == 0 || currentTile.column == 0 || currentTile.row == this.height - 1 || currentTile.column == this.width - 1){
                inside = false
                break
            }
            checked.push(currentTile);
            console.log("checking these: ")
            if(!checked.includes(this.tileStates[currentTile.row + 1][currentTile.column])) {
                console.log(this.tileStates[currentTile.row + 1][currentTile.column])
                stack.push(this.tileStates[currentTile.row + 1][currentTile.column])
            }
            if(!checked.includes(this.tileStates[currentTile.row - 1][currentTile.column])) {
                console.log(this.tileStates[currentTile.row - 1][currentTile.column])
                stack.push(this.tileStates[currentTile.row - 1][currentTile.column])
            }
            if(!checked.includes(this.tileStates[currentTile.row][currentTile.column + 1])) {
                console.log(this.tileStates[currentTile.row][currentTile.column + 1])

                stack.push(this.tileStates[currentTile.row][currentTile.column + 1])
            }
            if(!checked.includes(this.tileStates[currentTile.row][currentTile.column - 1])) {
                console.log(this.tileStates[currentTile.row][currentTile.column - 1])

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
    constructor(row: number,col: number, team:string){
        this.row = row;
        this.column = col;
        this.team = team;
        this.hasTrail = false;
    }
}



class Trail{
    head:boolean
    previous:Array<number>
    next:Trail
    tile:Array<number>
    team:string
    constructor(team:string, sourceTile:Tile, tile:Tile){
        this.head = true;

        this.team = team;

        this.previous = [sourceTile.row, sourceTile.column];
        if(sourceTile.hasTrail){
            sourceTile.trail.next = this
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


