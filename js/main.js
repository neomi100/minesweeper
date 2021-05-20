'use strict';


const MINE = '💣';
const FLAG = '🚩';
const GAMEֹֹֹ_OVER = '🎇';


var gSound = new Audio('http://freesoundeffect.net/sites/default/files/electronic-buzzer-incorrect-sound-effect-36279297.mp3')

// var gdifficulty;
var gBoard;
var gTimer= 0
var gFlagCount = 0
var gMinesNum;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed:0
}



function init() {
    timer()
    gBoard = createBoard();
    createMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard);
}



function createBoard() {
    var board = [];
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        for (var j = 0; j < 4; j++) {

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

function createMine(board) {
    var mine = {
        location: {
            i: getRandomMintLocaition(0, 3),
            j: getRandomMintLocaition(0, 3)
        }
    };
    board[mine.location.i][mine.location.j].isMine = true
}


function createMines(board) {
    createMine(board);
    createMine(board);
    // להוסיף תנאי שמייצר פצצות ביחס לגודל הלוח
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
            // strHTML += `<td onclick="cellClicked(${i},${j},this)" class="cell">${cell}</td>`;
            // 
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClicked(i, j, elCell,ev) {
console.log(ev);
    if (gBoard[i][j].isMine) {
        elCell.innerText = GAMEֹֹֹ_OVER
        gSound.play()
        gameOver()
    }
    if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true
        elCell.innerText = gBoard[i][j].minesAroundCount
        // לחסוף את התאים השכנים = 0 עד שמגיעים למספרים
    }

    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        elCell.classList.add('emptyCell')
        expandShown(i, j, elCell)
        // לחסוף את התאים השכנים = 0 עד שמגיעים למספרים
    }
    // if(מקש ימני){
    // elCell.innerText = FLAG
    // gFlagCount++
    // gBoard[i][j].isMarked= true
    // gBoard[i][j].isShown = true
    // }

}

function expandShown(cellI, cellJ, elCell) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
        
            if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                elCell.classList.add('emptyCell')
                 if (gBoard[i][j].minesAroundCount > 0) {
                gBoard[i][j].isShown = true
                elCell.innerText = gBoard[i][j].minesAroundCount
                continue;
            }
            // else{
            //     expandShown(i, j, elCell)
            // }
            }
            
        }
    }
}


function timer() {
    //  setInterval(function () {
        var elTimer = document.querySelector('.time');
        gTimer += 0.0
        // console.log(gTimer.toFixed(3));
        elTimer.innerText = gTimer.toFixed(3)
    // }, 10)
}


function gameOver() {
    gGame.isOn = false;
    document.querySelector('h3').innerText = 'Game Over'
    // לעצור את הזמן

}
function restartGame() {
    gGame.isOn = true;
    elBtn.innerText = gGame.isOn ? '😁' : '😓';
    // init()
}

// function gameOver() {

// }

function getRandomMintLocaition(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function levelChange(elBtn) {
//     switch (elBtn.innerText) {
//         case 'Easy':
//             elBtn.innerText = 'Medium';
//             gDifficulty = 25;
//             break;
//         case 'Medium':
//             elBtn.innerText = 'Hard';
//             gDifficulty = 36;
//             break;
//         case 'Hard':
//             elBtn.innerText = 'Easy';
//             gDifficulty = 16;
//             break;
//     }
//     init();
// }