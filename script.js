//Game board object responsible for the grid
function gridItem(value, id){
    const container = document.querySelector(".gridContainer")
    this.value = value
    this.id = id

    const gridItem = document.createElement("div")
    gridItem.classList.add("gridItem")
    gridItem.id = this.id;
    gridItem.textContent = this.value;
    
    container.appendChild(gridItem);
    
    return gridItem;
}


function gameBoard() {
    //Grid
    const rows = 3;
    const columns = 3;
    const board = []


    //     //Grid creation loop
    // for (let i = 0; i < rows; i++) {   //3 rows created
    //     for (let j = 0; j < columns; j++) { //for each row 3 columns create
    //     gridItem("0");
    //     }
    // }
    


    //Grid creation loop
    for (let i = 0; i < rows; i++) {   //2 rows created
        board[i] = []
        for (let j = 0; j < columns; j++) { //for each row 3 columns create
            board[i].push("");
            gridItem("","cell-" + i + "-" + j )
        }
    }


    
    //Functionality to accept player's token and prevent replacing
    function addToken(row,col,token) {
        if(board[row][col] !="") {
            console.log("Cell occupied")
        } else {
            board[row][col] = token;
            
            const gridCell = document.getElementById("cell-" + row + "-" + col)
            gridCell.textContent = token;
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
        for (let i = 0; i < rows; i++) {
            board[i] = []
            for (let j = 0; j < columns; j++) {
                board[i][j] = "";
                const gridCell = document.getElementById("cell-" + i + "-" + j)
                gridCell.textContent = "";
            }
        }
    };

    
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

    const playerDialog = document.getElementById("newGameDialog"); 
    const newGameBtn = document.getElementById("newGame") 

    newGameBtn.addEventListener("click", () => {
        playerDialog.showModal();
    } )


    let player1 = "";
    let player2 = "";
    let p1score = 0;
    let p2score = 0;
    let activePlayer = "";

    //Submission of players to the game
    document.getElementById("newGameDialog").addEventListener("submit", function(event) {
    event.preventDefault(); //To stop attempt to send data to non existant server

    const p1 = document.getElementById("p1").value;
    const p2 = document.getElementById("p2").value;

    player1 = new player(p1, "X");
    player2 = new player(p2, "0");
    activePlayer = player1;
    
    
    //Update the player/score containers
    const p1NameDisplay =  document.getElementById("p1Name")
    p1NameDisplay.textContent = p1 + "'s Score (X):"
    const p2NameDisplay =  document.getElementById("p2Name")
    p2NameDisplay.textContent = p2 + "'s Score (0):"

    const p1ScoreDisplay =  document.getElementById("p1Score")
    p1ScoreDisplay.textContent = p1score;
    const p2ScoreDisplay =  document.getElementById("p2Score")
    p2ScoreDisplay.textContent = p2score;


    display("Turn: " + getActivePlayer().name) 
    playerDialog.close();

    });





    //Swtiches players
    const switchPlayerTurn = () => {
        if(activePlayer === player1) {
            activePlayer = player2
        } else {
            activePlayer = player1}
    };

    //Gets active player after swtich
    const getActivePlayer = () => activePlayer;


    function display(text) {
        const display = document.querySelector(".display")
        display.textContent = text

        return display
    };


    //Grid click function
    const gridCell = document.querySelectorAll(".gridItem")
    gridCell.forEach(cell => {
        cell.addEventListener("click", () => {
            const currentBoard = board.getBoard();
            const currentToken = getActivePlayer().token;
            

            const parts = cell.id.split("-"); // ["cell", "1", "2"]
            const row = parseInt(parts[1]);
            const col = parseInt(parts[2]); 

            if (board.checkWinner(currentBoard, currentToken)) {
                display(getActivePlayer().name + " WON");

            } else if (!board.checkWinner(currentBoard, currentToken) && board.isBoardFull(currentBoard)) {
                display("It's a Tie! Game over.");
                
            } else {
                playRound(row, col, getActivePlayer().token)

            } 
        } )   
    })


    function resultDialog(result, p1score, p2score) {
        const resultDialog = document.getElementById("gameResultDialog"); 
        const nxtRoundBtn = document.getElementById("nxtRoundBtn");
        const restartBtn = document.getElementById("restartGame");
        const legendTxt = document.querySelector(".gameResult");

        resultDialog.showModal();
        legendTxt.textContent = result;

        // Remove previous listeners to avoid stacking
        nxtRoundBtn.replaceWith(nxtRoundBtn.cloneNode(true));
        restartBtn.replaceWith(restartBtn.cloneNode(true));

        const newNxtRoundBtn = document.getElementById("nxtRoundBtn");
        const newRestartBtn = document.getElementById("restartGame");

        newNxtRoundBtn.addEventListener("click", () => {
            const p1ScoreDisplay = document.getElementById("p1Score");
            p1ScoreDisplay.textContent = p1score;
            const p2ScoreDisplay = document.getElementById("p2Score");
            p2ScoreDisplay.textContent = p2score;

            resultDialog.close();
            board.resetBoard();
        });

        newRestartBtn.addEventListener("click", () => {
            resultDialog.close();

        });
    }



    //Plays rounds and checked for winners or tie
    const playRound = (row, col, token) => {
        board.addToken(row, col, token);

        const currentBoard = board.getBoard();
        const currentToken = getActivePlayer().token;

        if (board.checkWinner(currentBoard, currentToken)) {

            resulttext = getActivePlayer().name + " WON" 

            if(getActivePlayer().name == player1.name) {
               p1score++;
            } else {
                p2score++;
            };
            resultDialog(resulttext, p1score, p2score);

            display(getActivePlayer().name + " WON");


        } else if (!board.checkWinner(currentBoard, currentToken) && board.isBoardFull(currentBoard)) {
            
            // It’s a tie
            const resulttext = "It's a Tie!";
            resultDialog(resulttext, 0, 0);

        } else {
            // Continue game
            switchPlayerTurn();
            display("Turn: " + getActivePlayer().name);
        }
    };


    return {playRound, getActivePlayer};
};

const game = gameController();

