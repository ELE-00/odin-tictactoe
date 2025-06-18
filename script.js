/* 
Game play:
Player 1 - X
Player 2 - 0

3x3 grid

Players take turns and place the marker on the grid.
Once the marker is placed, it cannot be changed or overwritten.

WIN -> 3 markers of same kind are placed in row - vertical, horizontal or diagonal.
Tie -> 2 markers in a row not found.
Winning markers gets stricked through.
Winning marker = winning player.



Console Requisites:

Object - Gameboard
- Set up a grid using rows and columns variables
- Create an array using a loop
- find empty cells
- add player token to the board + winner/tie check
- print board
- return getBoard, addToken, PrinBoard



Object - Players
- Allows to asign a name to the player



Object - Game controller
- Get the board
- get the players

- ** round starts **
- current board prints
- player turn announced
- players drops a token in a column

- check if there is a winner or a tie, if note:

- players turn switched
- new round begins



row = (0)(1)(2)
columen= (0)(1)(2)

Grid
000
111
222



Rules:
- As little global code as possible. Use factories.

*/

function gameBoard() {
    //Grid
    const rows = 3;
    const columns = 3;
    const board = []


    //Grid creation loop
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push("");
        }
    }

    //Functionality to accept player's token and prevent replacing
    function addToken(row,col,token) {
        if(board[row][col] !="") {
            console.log("Cell occupied")
        } else {board[row][col] = token
        };
    };
    
    //Gets the current board
    const getBoard = () => {
        return board;
    };

    //Prints the grid in the console
    const printBoard = () => {
        return console.log(board)
    };

    //Checks winning patterns
    function checkWinner(board, token) {
        const winPatterns = [
             //Rows
            [[0, 0], [0, 1], [0, 2]], 
            [[1, 0], [1, 1], [1, 2]], 
            [[2, 0], [2, 1], [2, 2]], 
            //Columns
            [[0, 0], [1, 0], [2, 0]], 
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            //Diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],       
        ];
        return winPatterns.some(pattern => 
            pattern.every(([row, col]) => board[row][col] === token)
        );
    };

    function isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== ""));
    };


    //Created a new grid board
    const resetBoard = () => {
            //Grid creation loop
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push("");
        }
    };

    }
      return {addToken, printBoard, getBoard, resetBoard, checkWinner, isBoardFull};
}

//Player Object
function player(name, token) {
    this.name = name;
    this.token = token;
}


/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function gameController() {

    const board = gameBoard();

    const player1 = new player("Elvin", "x");
    const player2 = new player("Fira", "0");

    //Prints current board
    const printNewRound = () => {
        board.printBoard();
    };


    let activePlayer = player1;

    //Swtiches players
    const switchPlayerTurn = () => {
        if(activePlayer === player1) {
            activePlayer = player2
        } else {
            activePlayer = player1}
    };

    //Gets active player after swtich
    const getActivePlayer = () => activePlayer;


    //Plays rounds and checked for winners or tie
    const playRound = (row, col, token) => {
        board.addToken(row, col, token);

        const currentBoard = board.getBoard();
        const currentToken = getActivePlayer().token;
        
        if(board.checkWinner(currentBoard, currentToken)) {
            console.log(getActivePlayer().name + " WON")
        } else if (!board.checkWinner(currentBoard, currentToken) && board.isBoardFull(currentBoard)) {
            console.log("It's a Tie! Game over.")
        }else {
            switchPlayerTurn()
            printNewRound()
        }
    };


    return {playRound, getActivePlayer};
};

const game = gameController();


console.log("Current player:", game.getActivePlayer().name);
game.playRound(0, 0, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(2, 2, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(0, 2, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(1, 0, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(1, 1, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(0, 1, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(2, 1, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(2, 0, game.getActivePlayer().token);

console.log("Current player:", game.getActivePlayer().name);
game.playRound(1, 2, game.getActivePlayer().token);

