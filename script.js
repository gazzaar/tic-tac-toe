'use strict';

///////////////////////////////////////

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // This is where we get the cell by passing the row number and then take the column from that row
  const addCells = (rowNum, columnNum, player) => {
    const cell = board[rowNum][columnNum];
    if (cell.getValue() === '') {
      cell.addMark(player);
      return true; // Cell added successfully
    }
    return false; // Cell already occupied
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const gameOver = () => {
    if (board.every((row) => row.every((cell) => cell.getValue() !== ''))) {
      return true;
    }

    // Check for a winner
    const winningCombination = getWinningCombination();
    if (winningCombination) {
      return true; // Game over, there's a winner
    }
    return false; // Game is still ongoing
  };

  const getWinningCombination = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0].getValue() !== '' &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][0].getValue() === board[i][2].getValue()
      ) {
        return [
          [i, 0],
          [i, 1],
          [i, 2],
        ]; // Return winning combination
      }
    }
    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j].getValue() !== '' &&
        board[0][j].getValue() === board[1][j].getValue() &&
        board[0][j].getValue() === board[2][j].getValue()
      ) {
        return [
          [0, j],
          [1, j],
          [2, j],
        ]; // Return winning combination
      }
    }
    // Check diagonals
    if (
      board[0][0].getValue() !== '' &&
      board[0][0].getValue() === board[1][1].getValue() &&
      board[0][0].getValue() === board[2][2].getValue()
    ) {
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ]; // Return winning combination
    }
    if (
      board[0][2].getValue() !== '' &&
      board[0][2].getValue() === board[1][1].getValue() &&
      board[0][2].getValue() === board[2][0].getValue()
    ) {
      return [
        [0, 2],
        [1, 1],
        [2, 0],
      ]; // Return winning combination
    }
    return null; // No winning combination found
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, printBoard, addCells, gameOver, getWinningCombination };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** "": no token is in the square,
 ** O: noughts,
 ** X: crosses
 */

function Cell() {
  let value = '';

  // Accept a player's token to change the value of the cell
  const addMark = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'X',
      move: 'cross',
    },
    {
      name: playerTwoName,
      token: 'O',
      move: 'nought',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Add ${getActivePlayer().name}'s ${
        getActivePlayer().move
      } into row ${row} column ${column}...`
    );
    if (board.addCells(row, column, getActivePlayer().token)) {
      if (board.gameOver()) {
        const winner = board.getWinningCombination()
          ? getActivePlayer().name
          : "It's a draw!";
        board.printBoard();
        console.log(`Game over. ${winner} wins!`);
      } else {
        switchPlayerTurn();
        printNewRound();
      }
    } else {
      console.log('Cell already occupied. Try again.');
    }
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    printNewRound,
    getBoard: board.getBoard,
  };
}

// UI Game

const ScreenController = function () {
  const game = GameController();
  const container = document.querySelector('.container');

  const updateScreen = () => {
    container.innerHTML = '';
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    const playerTurnDiv = document.createElement('div');
    playerTurnDiv.classList.add('turn');
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    container.appendChild(playerTurnDiv);

    // Render board squares
    board.forEach((row, rowIndex) => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        rowDiv.appendChild(cellButton);
      });

      container.appendChild(rowDiv);
    });
  };

  // Add event listener for cell clicks
  container.addEventListener('click', clickHandlerBoard);

  // Modify clickHandlerBoard function to handle cell clicks
  function clickHandlerBoard(e) {
    const clickedCell = e.target.closest('.cell');
    if (!clickedCell) return; // Exit if the click is not on a cell

    const selectedRow = parseInt(clickedCell.dataset.row);
    const selectedColumn = parseInt(clickedCell.dataset.column);

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  // Initial render
  updateScreen();
};
ScreenController();
