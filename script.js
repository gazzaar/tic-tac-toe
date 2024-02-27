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
    const addRow = board.map((row, i, arr) => arr[rowNum])[rowNum];
    const addColumn = addRow[columnNum];
    const cell = addColumn;
    if (cell.getValue()) return;
    cell.addMark(player);
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

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, printBoard, addCells };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no token is in the square,
 ** O: noughts,
 ** X: crosses
 */

function Cell() {
  let value = 0;

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
    // Drop a token for the current player
    console.log(
      `Add ${getActivePlayer().name}'s ${
        getActivePlayer().move
      } into row ${row} column ${column}...`
    );
    board.addCells(row, column, getActivePlayer().token);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();

game.playRound(0, 0);
game.playRound(1, 1);
game.playRound(0, 2);
game.playRound(0, 1);
game.playRound(1, 0);
game.playRound(2, 0);
game.playRound(2, 1);
game.playRound(2, 2);
game.playRound(1, 2);
