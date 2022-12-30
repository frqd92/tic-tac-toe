
const AI = function(board){
    function random(){
        return freeSpots()[Math.floor(Math.random() * freeSpots().length)]
    }
    function freeSpots(){
        return board.filter(elem=> typeof elem ==="number");
    }

    return{
        random
    }
    
}


let turn=1;
let indexBoard = [];
const GameBoard = (function(){
    function createBoard(){ // start/resets board
        document.querySelector(".board-container").innerHTML="";
        turn=1;
        for(let i=0;i<9;i++){
            indexBoard[i]=i;
            const square = document.createElement("div");
            square.id=i;
            square.classList.add("square");
            document.querySelector(".board-container").appendChild(square);
            square.addEventListener("click", turnRouter, {once:true});
            }
        }

    function turnRouter(e){
        let squareId = e.target.id;
        let player1 = checkPlayerMark()[0];
        let player2 = checkPlayerMark()[1];
        let player1Type =checkPlayerType()[0];
        let player2Type =checkPlayerType()[1];
        let aiPlayer = AI(indexBoard);

        if(turn>9){
            console.log("gameover")
        }
     
        if(player1Type==="Human" && player2Type==="Human"){                            //Human vs Human
            turn%2===0?playTurn(squareId,player2):playTurn(squareId,player1);
        }


        if(player1Type.includes("AI") || player2Type.includes("AI")){
            if(player1Type==="Human" || player2Type==="Human"){                    //human vs AI
                if(player1Type==="Human"){
                    playTurn(squareId,player1)
                    playTurn(aiPlayer.random(), player2)
                }
                else{
                    playTurn(squareId,player2)
                    playTurn(aiPlayer.random(), player1)
                }

            }
        }
        
    }
    //where you left off
    function selectRouter(type, select){ //in case player type is changed to ai midgame
        let ai = AI(indexBoard);
        console.log(select)
        console.log(document.querySelector(`.${select}`).innerText)
      
        if(turn%2==0 && document.querySelector(`.${select}`).innerText.includes("AI")){
            playTurn(ai.random(), "O")
       }
       
    };



    function playTurn(id, player){
        document.getElementById(id).textContent=player;
        indexBoard[id]=player;
        turn++;
    }

    function checkPlayerMark(){
        const toggle = document.querySelector(".toggle");
        if(!toggle.classList.contains("toggle-1-O")){
            return ["X","O"];
        }
        else{
            return ["O","X"];
        }
    }
    function checkPlayerType(){
        let left, right;
        const leftPlayer = document.querySelector(".drop-text-1").textContent;
        const rightPlayer = document.querySelector(".drop-text-2").textContent;
        return [leftPlayer, rightPlayer]
    }

    document.getElementById("history-btn").addEventListener("click", (e)=>{
    // console.log(checkPlayerMark()[0], checkPlayerType()[0])
    // console.log(checkPlayerMark()[1], checkPlayerType()[1])

    console.log(indexBoard)
    console.log("turn: " + turn)

    })
    return {createBoard, turnRouter, selectRouter}
})



const game = GameBoard();
game.createBoard()
//------------------------------------------------------------------------------------------//
//Reset Button
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", ()=>{game.createBoard()});
//------------------------------------------------------------------------------------------//
//toggle player
const toggleContainer = document.querySelectorAll(".toggle-container");
toggleContainer.forEach(elem=>elem.addEventListener("click", toggleLogic));
function toggleLogic(){
    game.createBoard();
    toggle1 = document.querySelector(".toggle-1")
    toggle2 = document.querySelector(".toggle-2");
    toggle1.classList.toggle("toggle-1-O");
    toggle2.classList.toggle("toggle-2-X");
    if(toggle1.classList.contains("toggle-1-O")){
        toggle1.textContent="O";
        toggle2.textContent="X"
    }
    else{
        toggle1.textContent="X";
        toggle2.textContent="O"
    }

}
//------------------------------------------------------------------------------------------//

const selectMenu=function(className, index){
    const select = document.querySelector(`.${className}`);
    const menu = document.querySelector(`.menu-${index}`);
    const li = menu.querySelectorAll("li");
    const text = document.querySelector(`.drop-text-${index}`);
    const aiChange = GameBoard();
    select.addEventListener("click", showMenu, {once:true});
    function showMenu(){
        menu.style.visibility="visible";
        li.forEach(elem=>{
            elem.textContent===text.textContent?elem.style.background="rgba(0, 21, 255, 0.356)": elem.style.background="";
            elem.addEventListener("click", liFunc, {once:true})
        })
    }
    function liFunc(e){
        e.stopPropagation();
        text.textContent = e.target.textContent
        menu.style.visibility="hidden";
        select.addEventListener("click", showMenu, {once:true});
        aiChange.selectRouter(e.target.textContent, `drop-${index}`);
    }
}   
const selectLeft = selectMenu("drop-1", 1);
const selectRight = selectMenu("drop-2", 2);

