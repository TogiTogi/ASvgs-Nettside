/*Game logic*/

export const TILE_STATUSES = { //creates different statuses that the tiles can have
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)
     //shows mines on console and inspect element
    
    //Creates the board structure
    for (let x = 0; x < boardSize; x++) {   
        const row = [] //creates a row
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div") //creates a div element so that the board can be displayed on the screen
            element.dataset.status = TILE_STATUSES.HIDDEN //Byz default every tile is hidden / when the game starts

            //mine placement, check to not place same position.
            const tile = { //creating each tile
                element,
                x, //gives the object (tile) an x and a y property
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})), //check if mine is matching x and y coordinates / if the mines match the x and y above, return true.
                get status() {
                    return this.element.dataset.status //this keyword refers to the current object. You have to return this element.dataset.status
                },
                set status(value) { //connects the color data set statuses from css to here.
                    this.element.dataset.status = value
                }
            }

            row.push(tile) //adding the tiles into the row array
        }
        board.push(row) //adds row to the board
    }

    return board
}

export function markTile(tile) {
    if (
        tile.status !== TILE_STATUSES.HIDDEN &&  //checking if tile is hidden or marked
        tile.status !== TILE_STATUSES.MARKED
    ) {
        return //if tile is hidden or marked, continiue. If not, return prematurely.
                //if not hidden or marked = the tile is then either reviealed or a bomb.
    }

    if (tile.status === TILE_STATUSES.MARKED) { //makes it so statuses change on/off when right clicking a tile.
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
        // CHECK HERE FOR END WIN IDEA (Making all bombs yellow when win)
    }
}

export function revealTile(board, tile) { //need acsess to baord for numbers to work
   if (tile.status !== TILE_STATUSES.HIDDEN) { //if tiles are not hidden, return it so it doesnt go in to effect
    return
   }
   
   if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
   }

   tile.status = TILE_STATUSES.NUMBER
   const adjacentTiles = nearbyTiles(board, tile) //variable for tiles next to bombs
   const mines = adjacentTiles.filter(t => t.mine) //.filter filters/tests out if there is a mine around the clicked tile or not
   if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board)) // reveals empty tile besides the one you clicked / bild  binds an object to a functon u choose. Makes function bound to / for each. Chooses each tile around chosen tile to run the same code
   } else {
    tile.element.textContent = mines.length //if one or more mines are deted around a tile, it wil display that on the clicked tile using .textContent .
   }
}

export function checkWin(board) {
   return board.every(row => {
    return row.every(tile => {
        return (tile.status === TILE_STATUSES.NUMBER || 
            (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || //if tile is a mine, win if all is either hidder or marked
                tile.status === TILE_STATUSES.MARKED))
                
        )
    })
   })
}

export function checkLose(board) { //checs if a mine had been revealed.
    return board.some(row => {//checks all the rows on the board
        return row.some(tile => {//checs all the tiles on the rows
            return tile.status === TILE_STATUSES.MINE //checs if the tile status has become a mine.
        })
    })
}


function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) { //while positions.length is less than the number of mines we want, continiue loop. useing a while loop so that it checks all the time
        const position = {
            x: randomNumber(boardSize), //gives random number between board size
            y: randomNumber(boardSize)
        }
        if (!positions.some(positionMatch.bind(null, position))) { //if a bomb is already there, skip it.
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a, b) { //Checks if bombs have the same coordinates. If bomb a. x and a.y have he same coordinates as bomb b.x and .y.
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) { //Returns a random number / radomizer / math.floor, removes comma. /makes it an integer / helt tall
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, {x, y}) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) { //gets positions for the y offsets around a clicked tile. Same applies for the x above.
            const tile = board[x + xOffset]?.[y + yOffset] //Chest curent x position + xOffset (between -1 and 1). Same aplies for Y. / ?. is so that it only tries to check above it, if there is a tile there aka  if board[x + xOffset] is true, continiue
            if (tile) tiles.push(tile)
        }
    }
    return tiles
}