//bugs: when playing human vs human and changing O player turn to AI when it's human's turn it plays O again.
//ai still wonky
//make a div that takes half the space of the player info rectangle and it shifts at the turn
// in the menu, prevent users from clicking on already selected player type
let historyArr = [];
let turn=1;
let indexBoard = [];
const GameBoard = function(){
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
    function turnClickRouter(e){if(!e.target.textContent){moveRouter(e.target.id)}};

    function menuRouter(){moveRouter(null)};

    function moveRouter(id){
        const player1 = playerObjects()[0];
        const player2 = playerObjects()[1];
        //if human vs Ai: find out which player is AI in order to feed it as a parameter to minimax
        //ai2 for ai vs ai
        let ai;
        if((player1.type==="Human" || player2.type==="Human") && (player1.type!=="Human" || player2.type!=="Human")){
            if(player1.type!=="Human"){
                ai = AI(indexBoard, player1.marker)
            }  
            else{
                ai = AI(indexBoard, player2.marker);
            } 
        }
        if(id!==null){ //if click comes from square
            //Human vs Human
            if(player1.type==="Human" && player2.type==="Human"){       
                turn%2!==0?playTurn(id, "X"):playTurn(id, "O");
            }
            //Human vs AI (if Human is X), only way to change X to ai is from the menu buttons, so menuRouter had to be created.
            if((player1.type==="Human" || player2.type==="Human") && (player1.type!=="Human" || player2.type!=="Human")){
                if( (checkPlayerMark().indexOf("X")===0 && player2.type.includes("AI")) || 
                    (checkPlayerMark().indexOf("X")===1 && player1.type.includes("AI"))){
                    playTurn(id, "X");
                    if(player1.type.includes("random") || player2.type.includes("random")){
                        playTurn(ai.random(), "O");
                    }
                    else if(!player1.type.includes("random") || !player2.type.includes("random")){
                        playTurn(ai.idealSquare(), "O");
                    }
                }
                else{
                    playTurn(id, "O");
                    if(player1.type.includes("random") || player2.type[1].includes("random")){
                        playTurn(ai.random(), "X");
                    }
                    else{
                        playTurn(ai.idealSquare(), "X");
                    }
                }
            }
        }

        else{ //if click comes from player type selection
            if(checkPlayerType()[0].includes("AI") && checkPlayerType()[1].includes("AI")){ //AI VS AI
                const ai2 = AI(indexBoard, "X");
                const ai3 = AI(indexBoard, "O");
                if(player1.type.includes("random")){
                    typePlayer1 = ai2.random; 
                }
                else{
                    typePlayer1 = ai2.idealSquare;
                }
                if(player2.type.includes("random")){
                    typePlayer2 = ai3.random; 
                }
                else{
                    typePlayer2 = ai2.idealSquare; 
                }
                for(let i=0;i<=4;i++){
                    if(turn%2!==0){
                        time(i, "X", typePlayer1)
                        time(i, "O", typePlayer2)
                    }
                    else{
                        time(i, "O", typePlayer2)
                        time(i, "X", typePlayer1)
                    }         
                }
                function time(i, mark, aiType){
                    setTimeout(()=>{playTurn(aiType(), mark, true)}, 500 * i)
                }
            }
            else if(player1.type === "Human" || player2.type==="Human"){
                if( (checkPlayerMark().indexOf("X")===0 && player1.type.includes("AI")) || 
                (checkPlayerMark().indexOf("X")===1 && player2.type.includes("AI"))){
                    if(turn%2!==0){
                        if(checkPlayerType()[0].includes("random") || checkPlayerType()[1].includes("random")){
                            playTurn(ai.random(), "X");
                        }
                        else{
                            playTurn(ai.idealSquare(),"X");
                        }
                    }
            }
            else{
                if(turn>1 && turn%2===0){
                    if(player1.type.includes("random") || player2.type.includes("random")){
                        playTurn(ai.random(), "O");
                    }
                    else{
                        playTurn(ai.idealSquare(), "O");
                    }
                }
            }
            }

        }
        }
    function playTurn(id, player){
        if(turn>9 && !checkPattern(indexBoard, "X") && !checkPattern(indexBoard, "O")){ //tie
            whoWon(null);
            return;
        }
        if(!checkPattern(indexBoard, "X") && !checkPattern(indexBoard, "O")){ //gameplay
            indexBoard[id]=player;
            document.getElementById(id).textContent=player;  
            turn++;   
            historyArr.push({mark: player, id: parseInt(id)})
            console.log(historyArr)
        }
        if(checkPattern(indexBoard, player)){   //win
            console.log("gameover")
            let winner = checkPattern(indexBoard, player);
            whoWon(winner);
        }

        //delete
        const testing = document.querySelector(".testdiv")
        testing.style.display = "block"
        testing.innerHTML = `
        arr: ${indexBoard} <br> turn: ${turn} <br> `
        //delete
    }
    function whoWon(winner){
        if(!winner){
            console.log("tie")
        }
        else{
            const squares = document.querySelectorAll(".square");
            let winArray = winner.indexOfWin;
            winArray.forEach((e,i)=>{squares[winArray[i]].style.background = 'rgba(60, 69, 127, 0.344)';})
        }
    }
    function checkPattern(board, mark){
        const winArray = [ [0,4,8], [2,4,6], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8] ];
        let patternArr=[], winner ={};
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
        return null; //no winner, to skip checking terminal state in minimax
    }

    function checkPlayerMark(){
        return !document.querySelector(".toggle").classList.contains("toggle-1-O")?["X","O"]:["O","X"];
    }
    function checkPlayerType(){
        return [document.querySelector(".drop-text-1").textContent, document.querySelector(".drop-text-2").textContent]
    }
    function playerObjects(){
        let player1 = {
            name: document.getElementById("input-1").value,
            type: checkPlayerType()[0],
            marker:checkPlayerMark()[0]
        }
        let player2 = {
            name: document.getElementById("input-2").value,
            type: checkPlayerType()[1],
            marker: checkPlayerMark()[1]
    
        }
        return [player1, player2]
    }
    return {createBoard, menuRouter, checkPattern}
}

const AI = function(board, aiMark){
    function idealSquare(){
        return miniMax(board, aiMark).index;
    }
    function miniMax(board, player){
        const checker = GameBoard(); //how to assign this without running it?
        let emptySquares = freeSpots();
        let opponent = player==="X"?"O":"X";

        //check for terminal state
        if(checker.checkPattern(board, aiMark)){return {points: 100};}
        else if(checker.checkPattern(board, opponent)){return {points: -100};}
        else if(freeSpots().length===0){return {points: 0};}

        let moveHistory = [];
        for(let i=0;i<emptySquares.length;i++){
            let possMove = {};
            possMove.index = board[emptySquares[i]];
            board[emptySquares[i]]=player;
            if(player===aiMark){
                let outcome = miniMax(board, opponent);
                possMove.points = outcome.points;
            }
            else{
                let outcome = miniMax(board, aiMark);
                possMove.points = outcome.points;
            }
            board[emptySquares[i]] = possMove.index;
            moveHistory.push(possMove)
        }
        let idealMove;
        if(player===aiMark){
            let highestPoint = -Infinity;
            for(let i=0;i<moveHistory.length;i++){
                if(moveHistory[i].points > highestPoint){
                    highestPoint = moveHistory[i].points;
                    idealMove=i;
                }
            }
        }
        else{
            let highestPoint = Infinity;
            for(let i=0;i<moveHistory.length;i++){
                if(moveHistory[i].points < highestPoint){
                    highestPoint = moveHistory[i].points;
                    idealMove=i;
                }
            }
        }
        return moveHistory[idealMove]
    }

    function random(){
        console.log("random")
        return freeSpots()[Math.floor(Math.random() * freeSpots().length)]
    }

    function freeSpots(){
        return board.filter(elem=> typeof elem ==="number");
    }

    return{random, idealSquare}
}


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

