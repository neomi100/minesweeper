'use strict';

const MINE = '💣';
const FLAG = '🚩';


var gSound = new Audio('http://freesoundeffect.net/sites/default/files/electronic-buzzer-incorrect-sound-effect-36279297.mp3')


var gBoard;
var gInterval;
var gTimer = 0;
var gFlagCount;
var gFirstClick = 0;
var gShownMinesCount = 0;



var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0
};
var gLevel = { size: 4, mines: 2 };


function init() {
    gGame.isOn = true;
    gBoard = createBoard();
    clearInterval(gInterval);
    gTimer = 0.00;
    gInterval = null;
    renderBoard(gBoard);
    gGame.shownCount = 0;
    gFirstClick = 0;
    gShownMinesCount = 0;
    gFlagCount = gLevel.mines;
    document.querySelector('.flag').innerText = 'You have  ' + gFlagCount + ' flags';
    document.querySelector('h3').innerText = 'Beware of the Mines!';
    if (gLevel.size === 4) {
        document.querySelector('.lives').innerText = '💜💜';
    } else {
        document.querySelector('.lives').innerText = '💜💜💜';
    }
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
            board[i][j] = cell;
        }
    }
    return board;
}

function setDifficult(boardsize, mineNum) {
    gLevel.size = boardsize;
    gLevel.mines = mineNum;
    gFlagCount = mineNum;
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
    var mine = gLevel.mines;
    while (mine > 0) {
        var i = getRandomMintLocaition(0, board.length - 1);
        var j = getRandomMintLocaition(0, board.length - 1);
        if (board[i][j].isMine === true || board[i][j].isShown === true) continue;
        board[i][j].isMine = true;
        mine--;
    }
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = '';
            if (gBoard[i][j].isShown) cell = board[i][j].minesAroundCount;
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) cell = MINE;
            if (gBoard[i][j].isMarked) cell = FLAG;
            strHTML += `<td onmousedown="cellClicked(${i},${j},this,event)" class="cell">${cell}</td>`;
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

    if (!gGame.isOn) return;
    if (gFirstClick === 0) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('occupied')
        console.log(elCell);
        placeMine(gBoard);
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        gFirstClick--;
    }
    if (gTimer === 0) timer();
    if (ev.button === 0) {
        if (gBoard[i][j].isMine) {
            gSound.play();
            gBoard[i][j].isShown = true;
            gShownMinesCount++;
            elCell.innerText = MINE;
            if (gLevel.size === 4 && gShownMinesCount === 1) document.querySelector('.lives').innerText = '💜🤍';
            if (gLevel.size === 4 && gShownMinesCount === 2) {
                gameOver();
                document.querySelector('.lives').innerText = '🤍🤍';
            }
            if (gLevel.size === 8 || gLevel.size === 12) {
                if (gShownMinesCount === 1) document.querySelector('.lives').innerText = '💜💜🤍';
                if (gShownMinesCount === 2) document.querySelector('.lives').innerText = '💜🤍🤍';
                if (gShownMinesCount === 3) {
                    gameOver();
                    document.querySelector('.lives').innerText = '🤍🤍🤍';
                }
            }

        }
        if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elCell.innerText = gBoard[i][j].minesAroundCount;
        if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true;
            expandShown(i, j, gBoard);
        }
    }
    if (ev.button === 2) {
        if (gBoard[i][j].isShown) return;
        if (!gBoard[i][j].isMarked && gFlagCount > 0) {
            gBoard[i][j].isMarked = true;
            elCell.innerText = FLAG;
            gFlagCount--;
        } else if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false;
            elCell.innerText = '';
            gFlagCount++;
        }
        document.querySelector('.flag').innerText = 'You have more ' + gFlagCount + ' flag';
    }
    if (gLevel.size === 4 && gGame.shownCount === gLevel.size ** 2 - gLevel.mines && gShownMinesCount <= 1 && gFlagCount <= 1 ||
        gLevel.size === 8 && gGame.shownCount === gLevel.size ** 2 - gLevel.mines && gShownMinesCount <= 2 && gFlagCount <= 10 ||
        gLevel.size === 12 && gGame.shownCount === gLevel.size ** 2 - gLevel.mines && gShownMinesCount <= 2 && gFlagCount <= 28) youWin();


}

function expandShown(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMarked || board[i][j].isShown) continue;
            board[i][j].isShown = true;
            gGame.shownCount++;
        }
    }
    renderBoard(board)
}


function timer() {
    gInterval = setInterval(function () {
        var elTimer = document.querySelector('.time');
        gTimer += 0.001;
        elTimer.innerText = gTimer.toFixed(3)
    }, 100);
}


function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine || gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true;
                renderBoard(gBoard);
            }
        }
    }
    gGame.isOn = false;
    clearInterval(gInterval);
    gInterval = null;
    gTimer = 0.00;
    document.querySelector('.time').innerText = gTimer;
    document.querySelector('h3').innerText = 'Game Over!';
    document.querySelector('.smiley').innerText = '😓';

}

function youWin() {
    document.querySelector('h3').innerText = 'You Win!!';
    document.querySelector('.smiley').innerText = '😎';
    clearInterval(gInterval);
    gInterval = null;
    gTimer = 0.00;
}

function restartGame() {
    gGame.isOn;
    clearInterval(gInterval);
    gInterval = null;
    gTimer = 0.00;
    var elTimer = document.querySelector('.time');
    elTimer.innerText = gTimer;
    document.querySelector('.smiley').innerText = '😁';
    document.querySelector('h3').innerText = 'Beware of the Mines!';
    document.querySelector('.flag').innerText = 'You have  ' + gFlagCount + ' flags';
    init();
}



function getRandomMintLocaition(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

