'use strict';


const MINE = '💣';




// var gdifficulty;
var gBoard;
var gCell = {
    location: {
        i: '',
        j: ''
    },
    isMine: false,
    // isminesNeighbors: false,
    minesNeighborsNum: 0
};


function init() {
    gBoard = createBoard();
    renderBoard(gBoard);
}



function createBoard() {
    
    var board = [];
    for (var i = 0; i < 4; i++) {
        board.push([]);
        for (var j = 0; j < 4; j++) {
            board[i][j] = (Math.random() > 0.8) ? MINE : ' ' ;
            if (board[i][j] === MINE) {
                gCell.isMine = true
            }
            countMineNeighbors( i, j, board)
        }
    }
   
    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            
            var cell = board[i][j];
            
            strHTML += `<td onclick="cellClicked(${board[i][j]},this)" class="cell">${cell}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}




function countMineNeighbors(cellI, cellJ, board) {
    console.table(board);
    var mineNeighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[0].length) continue;
            if (board[i][j] === MINE) mineNeighborsSum++;
            
//             // if (mineNeighborsSum === 0) gCell.isminesNeighbors = false
//             // if (mineNeighborsSum > 0) {
//                 //     gCell.isminesNeighbors = true
//                 //    
//                 //     // gCell.location.i = i
//                 // gCell.location.j = j
                
            }
        }
       
//     // renderCell(gCell.location, mineNeighborsSum)
//     // console.log(mineNeighborsSum);
    return mineNeighborsSum;
}


//   location such as: {i: 2, j: 7}
//   function renderCell(location, value) {
//     //   console.log(value);
//     // Select the elCell and set the value
//     var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//     elCell.innerHTML = value;
//   }


// function cellClicked(clickedNum) {
//     if (+clickedNum.innerText === gIdx) {
//         clickedNum.classList.add('covered')
//         if (gIdx === 1) {
//             gStartTime = '';
//             startInterval();
//         }
//         if (gIdx === gNumsLength) {
//             pauseInterval();
//         }
//         gIdx++;
//     }
// }