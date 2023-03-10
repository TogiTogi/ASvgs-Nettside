/*Game display/UI*/

import {
    TILE_STATUSES, 
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLose,
}   from "./minesweeper.js"



const BOARD_SIZE = 16
const NUMBER_OF_MINES = 50

const customSize = document.getElementById(`gridsize`);
console.log(customSize)

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES) // setting up the board board == board size and number of mines
const boardElement = document.querySelector(".board") //doc.qurey = searches for ("the content of this") in other documents it's connected to.
const minesLeftText = document.querySelector("[data-mine-count]") //sets the value of minesLeftText to the data mine count from intex.html
const messageText = document.querySelector(".minesleft")

//console.log(board)

board.forEach(row => { //loops through the board for each row
    row.forEach(tile => {
        boardElement.append(tile.element) //pust tiles on the board element created in ms.js (line 10)
        tile.element.addEventListener("click", () => { //click == left click. () = blank, there is nothing there, just a placeholder
            revealTile(board, tile) //revelsa tile of (tile) chosen //need acsess to board for numbers to work
            checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e => { //Context menu = whatever happenes when you right click. / e => is to initialize preventDefault.
            e.preventDefault() //makes it so the right click menu doesn't show up when rightclicking tiles.
            markTile(tile) //connects the right click function from minesweeper.js to script.js
            ListMinesLeft() //create a lst to check mines left
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)//Decides board size. Makes size the value of boardsize, which is set to BOARD_SIZE
minesLeftText.textContent = NUMBER_OF_MINES

//Mines left checker
function ListMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => { //.reduce = reduces it to a single variable. counts the ammount of of tiles each row
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length //.length gives us number of tiles that are marked
    }, 0) //Defaults to zero / count starts at 0
    //Takes the board and couts the number of marked tiles
    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount //minesLeftText.textContent transferes it so the html version understands it. / 
    //takes the number of marked tiles from the string of code above minus number of mines, and binds that to the  minesLeftText variable
    
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, {capture: true}) //capture = makes it so this is handled first if true.
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }
    if (win) {
        messageText.textContent = "\xa0 YOU WIN!!! （＊＾Ｕ＾）人（≧Ｖ≦＊）/"
        board.forEach(row => {
            row.forEach(tile => { //used my big brain to make this mysef (i feel really proud)        
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) markTile(tile)
            })
        })

    } else if (lose) {
        messageText.textContent = "┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┤You lose :(├┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┤( ͡° ͜ʖ├┬┴┬┴"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e){ //gives stopProp an event called e
    e.stopImmediatePropagation() //when e is executed, enable stopImmediatePropagation. This makes it so that code will stop at that line.
}                                //This way we can stop you form clicking when either winning or loosing


//TIMER
var timer;
var ele = document.getElementById('timer');

(function startTimer(){
  var sec = 0;
  timer = setInterval(()=>{
    ele.innerHTML =+ sec;
    sec++;
  }, 1000) // each 1 second
})()    