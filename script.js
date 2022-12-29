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
            square.addEventListener("click", turnRouter);
            }
        }

    function turnRouter(e){
        let player1 = checkPlayers()[0];
        let player2 = checkPlayers()[1];


    }

    function checkPlayers(){
        const toggle = document.querySelector(".toggle");
        if(!toggle.classList.contains("toggle-O")){
            return ["X","O"];
        }
        else{
            return ["O","X"];
        }
    }


    document.getElementById("history-btn").addEventListener("click", ()=>{
     
    console.log(checkPlayers()[0])
    })

    return {createBoard}
})




const game = GameBoard();
game.createBoard()
//------------------------------------------------------------------------------------------//
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", ()=>{game.createBoard()});
//------------------------------------------------------------------------------------------//
const toggleContainer = document.querySelectorAll(".toggle-container");

toggleContainer.forEach(elem=>{
    elem.addEventListener("click", toggleLogic, false);
})
function toggleLogic(e){
    game.createBoard();
    toggle1 = document.querySelector(".toggle-1")
    toggle2 = document.querySelector(".toggle-2");
    toggle1.classList.toggle("toggle-O");
    toggle2.classList.toggle("toggle-2-X");
    if(toggle1.classList.contains("toggle-O")){
        toggle1.textContent="O";
        toggle2.textContent="X"
    }
    else{
        toggle1.textContent="X";
        toggle2.textContent="O"
    }

}

function toggleLogicz(e){
    let tog;
    let tar = e.target;
    game.createBoard();
    if(tar.querySelector(".toggle-2")!=null || tar.classList.contains("toggle-2")){
        tog=document.querySelector(".toggle-2");
        tog.classList.toggle("toggle-2-X");



    }
    else{
        tog=document.querySelector(".toggle-1");
        tog.classList.toggle("toggle-O");
        tog.classList.contains("toggle-O")?tog.textContent="O":tog.textContent="X";
    }


}

// toggleContainer.addEventListener("click", ()=>{

// });
