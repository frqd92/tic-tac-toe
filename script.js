const AI = function(board, aiMark){

    function idealSquare(){
        return miniMax(board, aiMark);
    }

    function miniMax(board, aiMark){
        const checker = GameBoard();
        let emptySquares = freeSpots()
        let opponent;
        aiMark==="X"?opponent==="O":opponent==="X";

        //check for terminal state
        if(checker.checkPattern(board, aiMark)){
            console.log("hello")
            return {points:100}
        }
        else if(checker.checkPattern(board, opponent)){
            return {points:-100}
        }
        else if(freeSpots().length===0){
            return {points: 0};
        }


      

        return 0
    }

    function random(){
        return freeSpots()[Math.floor(Math.random() * freeSpots().length)]
    }
    function freeSpots(){
        return board.filter(elem=> typeof elem ==="number");
    }

    return{
        random, idealSquare
    }
    
}


let testarr = [];
let turn=1;
let indexBoard = [];
const GameBoard = (function(){
    console.log("test")
    function createBoard(){ // start/resets board
        document.querySelector(".board-container").innerHTML="";
        turn=1;
        for(let i=0;i<9;i++){
            indexBoard[i]=i;
            const square = document.createElement("div");
            square.id=i;
            square.classList.add("square");
            document.querySelector(".board-container").appendChild(square);
            square.addEventListener("click", turnClickRouter, {once:true});
            }
        }
  
    function turnClickRouter(e){
        moveRouter(e.target.id) 
    }
    function menuRouter(){
        moveRouter(null)
    }
    function moveRouter(id){
        const player1 = playerObjects()[0];
        const player2 = playerObjects()[1];

        //if human vs Ai: find out which player is AI in order to feed it as a parameter to minimax
        let ai;
        if((player1.type==="Human" || player2.type==="Human") && (player1.type!=="Human" || player2.type!=="Human")){
            player1.type!=="Human"? ai = AI(indexBoard, player1.marker) : ai = AI(indexBoard, player2.marker);
        }


        if(id!==null){ //if click comes from square
            //Human vs Human
            if(player1.type==="Human" && player2.type==="Human"){       
                turn%2!==0?playTurn(id, "X"):playTurn(id, "O");
            }
            //Human vs AI (if Human is X), only way to change X to ai is from the menu buttons, so menuRouter had to be created. As this function is only executed from square clicking
            if((player1.type==="Human" || player2.type==="Human") && (player1.type!=="Human" || player2.type!=="Human")){
                if( (checkPlayerMark().indexOf("X")===0 && checkPlayerType()[1].includes("AI")) || 
                    (checkPlayerMark().indexOf("X")===1 && checkPlayerType()[0].includes("AI"))){
                    playTurn(id, "X");
                    if(checkPlayerType()[0].includes("random") || checkPlayerType()[1].includes("random")){
                        playTurn(ai.random(), "O");
                    }
                    else{
                        playTurn(ai.idealSquare(), "O");
                    }
                }
                else{
                    playTurn(id, "O");
                    if(checkPlayerType()[0].includes("random") || checkPlayerType()[1].includes("random")){
                        playTurn(ai.random(), "X");
                    }
                    else{
                        playTurn(ai.idealSquare(), "X");
                    }
                }
            }
        }
        else{ //if click comes from player type selection
            if( (checkPlayerMark().indexOf("X")===0 && checkPlayerType()[0].includes("AI")) || 
                (checkPlayerMark().indexOf("X")===1 && checkPlayerType()[1].includes("AI"))){
                if(turn%2!==0){
                    if(checkPlayerType()[0].includes("random") || checkPlayerType()[1].includes("random")){
                        playTurn(ai.random(), "X");
                    }
                    else{
                        playTurn(ai.idealSquare(), "X");
                    }
                  
                }
            }
            else{
                if(turn>1){
                    if(checkPlayerType()[0].includes("random") || checkPlayerType()[1].includes("random")){
                        playTurn(ai.random(), "O");
                    }
                    else{
                        playTurn(ai.idealSquare(), "O");
                    }
                }

            }
        }
        }

    function playTurn(id, player){
            document.getElementById(id).textContent=player;
            indexBoard[id]=player;
            if(checkPattern(indexBoard, player)){
                console.log("gameover")
                console.log(checkPattern(indexBoard, player))

            }

            turn++;
        
        if(turn>9){
            console.log("gameover")
        }

  


        const testing = document.querySelector(".testdiv")
        testarr.push(player)
        testing.innerHTML = `
        arr: ${indexBoard} <br> turn: ${turn} <br> plays: ${testarr} <br> `
    }

    function checkPattern(board, mark){
        const winArray = [ [0,4,8], [2,4,6], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8] ];
        let patternArr=[],winner ={};
        board.map((elem, index)=>{if(elem===mark) patternArr.push(index)});
        for(let i=0;i<winArray.length;i++){
            let count=0;
            for(let x=0;x<patternArr.length;x++){
                if(patternArr.includes(winArray[i][x]))count++;
                if(count===3){
                    winner.mark = mark;
                    winner.indexOfWin = winArray[i];
                    return winner;
                }
            }
     
        }
        return null;
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
    function playerObjects(){
        const input1 = document.getElementById("input-1").value
        const input2 = document.getElementById("input-2").value
        let player1 = {
            name: input1,
            type: checkPlayerType()[0],
            marker:checkPlayerMark()[0]
        }
        let player2 = {
            name: input2,
            type: checkPlayerType()[1],
            marker: checkPlayerMark()[1]
    
        }
        return [player1, player2]
    }





    document.getElementById("history-btn").addEventListener("click", (e)=>{
    // console.log(checkPlayerMark()[0], checkPlayerType()[0])
    // console.log(checkPlayerMark()[1], checkPlayerType()[1])

    console.log(indexBoard)
    console.log("turn: " + turn)

    })
    return {createBoard, menuRouter, checkPattern}
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
        if(e.target.textContent.includes("AI")){
            const aiChange = GameBoard();
            aiChange.menuRouter(e.target.textContent);
        }

    }
}   
const selectLeft = selectMenu("drop-1", 1);
const selectRight = selectMenu("drop-2", 2);




/*

        let player1 = checkPlayerMark()[0];
        let player2 = checkPlayerMark()[1];
        let player1Type =checkPlayerType()[0];
        let player2Type =checkPlayerType()[1];
        let aiPlayer = AI(indexBoard);

        if(turn>9){
            console.log(turn)
        }
     
        if(player1Type==="Human" && player2Type==="Human"){                            //Human vs Human
            turn%2===0?playTurn(squareId,player2):playTurn(squareId,player1);
        }

----------------------------

        if(player1Type.includes("AI") || player2Type.includes("AI")){
            if(player1Type==="Human" || player2Type==="Human"){                    //human vs AI

                if(player1Type==="Human"){
                    playTurn(squareId,player1)
                    setTimeout(()=>playTurn(aiPlayer.random(), player2),300);
                }
                else{
                    playTurn(squareId,player2)
                    setTimeout(()=>playTurn(aiPlayer.random(), player1),300);
                }

            }
        }
----------------------------------
    //where you left off
    function selectRouter(type, select){ //in case player type is changed to ai midgame
        let ai = AI(indexBoard);
        console.log(select)
        console.log(document.querySelector(`.${select}`).innerText)
        
        if(turn%2==0 && document.querySelector(`.${select}`).innerText.includes("AI")){
            playTurn(ai.random(), "O")
       }
       else if(turn>1){
        playTurn(ai.random(), "X")
 
       }
    };




*/