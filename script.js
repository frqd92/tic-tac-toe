const GameBoard = (function(){
    let indexBoard = [];

    function createBoard(){ // start/resets board
        document.querySelector(".board-container").innerHTML="";
        for(let i=0;i<9;i++){
            indexBoard[i]=i;
            const square = document.createElement("div");
            square.id=i;
            square.classList.add("square");
            document.querySelector(".board-container").appendChild(square);
            square.addEventListener("click", checkPlayer);
            }
        }

    function checkPlayer(e){

    }






    return { createBoard}
})

const newGame = GameBoard();
newGame.createBoard()
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", ()=>{newGame.createBoard()});


