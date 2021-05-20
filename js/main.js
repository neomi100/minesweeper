'use strict';


const MINE = '💣';
const FLAG = '🚩';
const GAMEֹֹֹ_OVER = '🎇';


var gSound = new Audio('http://freesoundeffect.net/sites/default/files/electronic-buzzer-incorrect-sound-effect-36279297.mp3')


var gDifficulty = gDifficulty
var gBoard;
var gTimer = 0
var gInterval;
var gFlagCount = 2
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    // secsPassed: 0,
}

// window.oncontextmenu = (e) => {
//     e.preventDefault();
// }

function init() {
    gGame.isOn = true
    gBoard = createBoard(gDifficulty);
    clearInterval(gInterval)
    gInterval = null
    var elTimer = document.querySelector('.time');
    elTimer.innerText = gTimer.toFixed(3)
    gTimer = 0
    setMinesNegsCount(gBoard)
    renderBoard(gBoard);
    document.querySelector('h3').innerText = 'Caution from the Mines!'

}



function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {

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



function createMines(gDifficulty, minesNum) {
    for (var i = 0; i < minesNum; i++) {
        gBoard[getRandomMintLocaition(0,gDifficulty-1)][getRandomMintLocaition(0, gDifficulty-1)].isMine = true
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
            strHTML += `<td onmousedown="cellClicked(${i},${j},this,event)" class="cell">${cell}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClicked(i, j, elCell, ev) {
    if (gInterval === null) timer()
    if (ev.button === 0) {
        if (gBoard[i][j].isMine) {
            gameOver()
            gSound.play()
            document.querySelector('h3').innerText = 'You lost Game Over!'
            elCell.innerText = GAMEֹֹֹ_OVER
        }
        if (gBoard[i][j].isShown === false) {
            gBoard[i][j].isShown = true
            elCell.innerText = gBoard[i][j].minesAroundCount
            elCell.classList.add('emptyCell')
            if (gBoard[i][j].minesAroundCount === 0)
                expandShown(i, j, elCell)
        }
    }
    if (ev.button === 2) {
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        elCell.innerText = FLAG
        if (gFlagCount--) {
            document.querySelector('h2').innerText = 'More ' + gFlagCount + 'flag you have '
        }

    }

}

function expandShown(cellI, cellJ, elCell) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;

            gBoard[i][j].isShown = true
            elCell.innerText = gBoard[i][j].minesAroundCount
            elCell.classList.add('emptyCell')
        }
    }
}


function timer() {
    gInterval = setInterval(function () {
        var elTimer = document.querySelector('.time');
        gTimer += 0.001
        elTimer.innerText = gTimer.toFixed(3)
    }, 1)
}


function gameOver() {
    clearInterval(gInterval)
    gInterval = null
    gGame.isOn = false;
    document.querySelector('h3').innerText = 'Game Over!'
    init()
}

function restartGame(elBtn) {
    if (gGame.isOn) {
        elBtn.innerText = '😁'
        clearInterval(gInterval)
        gInterval = null
        init()
    } else {
        elBtn.innerText = '😓'
        gGame.isOn = true;
        init()
    }
}



function getRandomMintLocaition(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
