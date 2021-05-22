'use strict';
// זאת העבודה שלי

const MINE = '💣';
const FLAG = '🚩';
// const GAMEֹֹֹ_OVER = '🎇';


var gSound = new Audio('http://freesoundeffect.net/sites/default/files/electronic-buzzer-incorrect-sound-effect-36279297.mp3')


var gBoard;
var gInterval;
var gTimer = 0
var gFlagCount;



var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    // secsPassed: 0
}
var gLevel = { size: 4, mines: 2 };


function init() {
    
    gGame.isOn = true
    gBoard = createBoard();
    placeMine(gBoard)
    clearInterval(gInterval)
    gTimer = 0.00
    gInterval = null
    setMinesNegsCount(gBoard)
    renderBoard(gBoard);
    gGame.shownCount = 0
    gFlagCount = gLevel.mines
    document.querySelector('.flag').innerText = 'You have  ' + gFlagCount + ' flags'
    document.querySelector('h3').innerText = 'Beware of the Mines!'
}



function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell
        }
    }
    return board;
}

function setDifficult(boardsize, mineNum) {
    gLevel.size = boardsize;
    gLevel.mines = mineNum
    gFlagCount = mineNum
    init();
}


function setMinesNegsCount(board) {
    var cell;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            cell = {
                i,
                j
            };
            if (board[cell.i][cell.j].isMine === true) continue;
            for (var a = cell.i - 1; a <= cell.i + 1; a++) {
                if (a < 0 || a >= board.length) continue;
                for (var b = cell.j - 1; b <= cell.j + 1; b++) {
                    if (a === cell.i && b === cell.j) continue;
                    if (b < 0 || b >= board[a].length) continue;
                    if (board[a][b].isMine === true) board[cell.i][cell.j].minesAroundCount++;
                }
            }
        }
    }

}

function placeMine(board) {
    var mine = gLevel.mines
    while (mine > 0) {
        var i = getRandomMintLocaition(0, board.length - 1)
        var j = getRandomMintLocaition(0, board.length - 1)
        if (board[i][j].isMine === true) continue
        board[i][j].isMine = true
        mine--
    }
}


function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = ''
            if (gBoard[i][j].isShown) cell = board[i][j].minesAroundCount
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) cell = MINE
            if (gBoard[i][j].isMarked){
                cell = FLAG
            } else{
                cell= ''
            }
            // var value = gBoard[i][j].isMine === true ? MINE : gBoard[i][j].minesAroundCount
            // elCell.innerText = value
            strHTML += `<td onmousedown="cellClicked(${i},${j},this,event)" class="cell">${cell}</td>`;
            // strHTML += `<td onclick="cellClicked(${i},${j},this)" class="cell">${cell}</td>`;
            // 
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

window.oncontextmenu = (e) => {
    e.preventDefault();
}

function cellClicked(i, j, elCell, ev) {
    if (!gGame.isOn) return
    if (gTimer === 0) timer()
    if (ev.button === 0) {
        if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return
        gBoard[i][j].isShown = true
        gGame.shownCount++
        elCell.innerText = gBoard[i][j].minesAroundCount
        if (gBoard[i][j].isMine) {
            // gSound.play()
            gBoard[i][j].isShown = true
            gGame.shownCount++
            elCell.innerText = MINE
            gameOver()
        }
        if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true
            expandShown(i, j, gBoard)  
        }
    }
    if (ev.button === 2) {
        if (gBoard[i][j].isShown) return
        if (gFlagCount === 0) return
        if (!gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = true
            elCell.innerText = FLAG
            gFlagCount--
        } else if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false
            elCell.innerText = ''
            gFlagCount++
        }
        document.querySelector('.flag').innerText = 'You have more ' + gFlagCount + ' flag'
    }
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines && gFlagCount === 0) {
        document.querySelector('h3').innerText = 'You Win!!'
        document.querySelector('.smiley').innerText = '😎';
        clearInterval(gInterval)
        gInterval = null
        gTimer = 0.00
    }
    console.log(gGame.shownCount);
}

function expandShown(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if ( board[i][j].isMarked ||board[i][j].isShown) continue;
            board[i][j].isShown = true
            gGame.shownCount++
        }
    }
    renderBoard(board)
}



function timer() {
    gInterval = setInterval(function () {
        var elTimer = document.querySelector('.time');
        gTimer += 0.001
        elTimer.innerText = gTimer.toFixed(3)
    }, 100)
}


function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine || gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true
                renderBoard(gBoard)
            }
        }
    }
    gGame.isOn = false
    clearInterval(gInterval)
    gInterval = null
    gTimer = 0.00
    // var elTimer =
    document.querySelector('.time').innerText = gTimer;
    // elTimer
    document.querySelector('h3').innerText = 'Game Over!'
    document.querySelector('.smiley').innerText = '😓';

}

function restartGame() {
    gGame.isOn
    // gFlagCount = mineNum
    clearInterval(gInterval)
    gInterval = null
    gTimer = 0.00
    var elTimer = document.querySelector('.time');
    elTimer.innerText = gTimer
    document.querySelector('.smiley').innerText = '😁';
    document.querySelector('h3').innerText = 'Beware of the Mines!'
    document.querySelector('.flag').innerText = 'You have  ' + gFlagCount + ' flags'
    init()
}



function getRandomMintLocaition(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

