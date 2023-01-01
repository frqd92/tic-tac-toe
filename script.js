
//in ai vs ai, sometimes it thinks random is minimax

//make a div that takes half the space of the player info rectangle and it shifts at the turn


//if reset board and ai vs ai, doesn't work unless click ai from menu again
//solution could be - if ai vs ai and turn is 1. reset btn displays "Fight robots!" instead of reset board



//try setting settimeout in minimax and not move router

let moveHistory=[];
let allGames=[];
let indexBoard = [] 
let turn=1;
const GameBoard = function(){
    function createBoard(){ // start/resets board
        document.querySelector(".board-container").innerHTML="";
        turn=1;
        moveHistory=[];
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
                player1.type.includes("random")?typePlayer1 = ai2.random:typePlayer1 = ai2.idealSquare;
                player2.type.includes("random")?typePlayer2 = ai3.random:typePlayer2 = ai3.idealSquare;
                let timer;
                for(let i=0;i<=4;i++){
                    if(turn%2!==0){
                        time(i, "X", typePlayer1)
                        time(i, "O", typePlayer2)
                    }
                    else{
                        time(i, "O", typePlayer1)
                        time(i, "X", typePlayer2)
                    }         
                }
                function time(i, mark, aiType){
                    timer = setTimeout(()=>{
                        if(checkPattern(indexBoard, mark) || turn>10){
                            clear(timer);
                            return;
                        }
                        playTurn(aiType(), mark);
                    }, 500 * i);
                    function clear(timer){
                        clearTimeout(timer)
                    }
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
        if(!checkPattern(indexBoard, "X") && !checkPattern(indexBoard, "O")){ //gameplay
            indexBoard[id]=player;
            if(indexBoard.filter(elem=>typeof elem!=="number").length<=9){
                document.getElementById(id).textContent=player;  
            }
            turn++;   
            moveHistory.push({mark: player, id: parseInt(id)})
        }
        if(checkPattern(indexBoard, player)){   //win
            console.log("2")

            let winner = checkPattern(indexBoard, player);
            declareWinner(winner);
            moveHistory.push(detectWinnerName(winner.mark))
            allGames.push(moveHistory)
        }
        else if(turn>9){ //tie
            console.log("1")
            moveHistory.push("tie")
            allGames.push(moveHistory)
            declareWinner(null);
            return;
        }

        //delete
        const testing = document.querySelector(".testdiv")
        testing.style.display = "block"
        testing.innerHTML = `
        arr: ${indexBoard} <br> turn: ${turn} <br> `
        //delete
    }
    function declareWinner(winner){
        if(!winner){
            declareResult();
        }
        else{
            const squares = document.querySelectorAll(".square");
            let winArray = winner.indexOfWin;
            winArray.forEach((e,i)=>{squares[winArray[i]].style.background = 'rgba(60, 69, 127, 0.344)';})
            declareResult(winner.mark)
        }
    }
    function detectWinnerName(mark){
        return document.querySelector(".toggle-1").innerText===mark?document.getElementById("input-1").value:document.getElementById("input-2").value;
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

//factory function for AI players
const AI = function(board, aiMark){
    function idealSquare(){
        console.log("minimax" + aiMark)
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

    function random(){console.log("random"+ aiMark ); return freeSpots()[Math.floor(Math.random() * freeSpots().length)]}

    function freeSpots(){return board.filter(elem=> typeof elem ==="number");}

    return{random, idealSquare}
}

//game Creation
const game = GameBoard();
game.createBoard()
//------------------------------------------------------------------------------------------//
//Reset Button
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", ()=>game.createBoard());
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
//Select player type menu
const selectMenu=function(className, index){
    const select = document.querySelector(`.${className}`);
    const menu = document.querySelector(`.menu-${index}`);
    const li = menu.querySelectorAll("li");
    const text = document.querySelector(`.drop-text-${index}`);
    select.addEventListener("click", showMenu);
    function showMenu(){
        menu.style.visibility="visible";
        li.forEach(elem=>{
            elem.textContent===text.textContent?elem.style.background="rgba(0, 21, 255, 0.356)": elem.style.background="";
                elem.addEventListener("click", liFunc, {once:true})
        })
        select.removeEventListener("click", showMenu);
    }
    function liFunc(e){
        e.stopPropagation();
        text.textContent = e.target.textContent
        menu.style.visibility="hidden";
        select.addEventListener("click", showMenu);
        if(e.target.textContent.includes("AI")){
            const aiChange = GameBoard();
            aiChange.menuRouter(e.target.textContent);
        }
    }
    window.addEventListener("click", e=>{ //close menu when clicking outside of it
        if(!e.target.className.includes("drop-down")){
            menu.style.visibility="hidden";
            select.addEventListener("click", showMenu);
        }
    })
}   
const selectLeft = selectMenu("drop-1", 1);
const selectRight = selectMenu("drop-2", 2);

window.addEventListener("click",(e)=>{
    if(e.target.textContent==="Game History"){
        console.log(allGames)
    }
})

//------------------------------------------------------------------------------------------//
//Winner announcer
function declareResult(mark){
    let player;
    if(mark){
        document.querySelector(".toggle-1").innerText===mark?player = document.getElementById("input-1").value:player = document.getElementById("input-2").value;
    }
    const modal = document.querySelector(".winner-announce");
    if(modal.childNodes.length<1){
        const text = document.createElement("p");
        const playAgainBtn = document.createElement("button");
        const modalBg = document.querySelector(".bg");
        modalBg.style.display="block";
        playAgainBtn.addEventListener("click", closeModal);
        modal.style.display="grid";
        modal.appendChild(text);
        modal.appendChild(playAgainBtn)
        text.textContent = player? `${player} is the winner!`: `Tie!`;
        playAgainBtn.textContent='Play Again?'
        function closeModal(e){
            if(e!=="noReset"){
                game.createBoard();
            }
            modal.innerHTML="";
            modal.style.display="none";
            modalBg.style.display="none";
        }
        modalBg.addEventListener("click", ()=>{ closeModal("noReset")})
    }
}

//------------------------------------------------------------------------------------------//
//Game History
const historyBtn = document.getElementById("history-btn");
historyBtn.addEventListener("click", showHistory);
let isHistory=false;
function showHistory(){
    if(!isHistory){
        document.querySelector(".history-mode").style.display="grid";
        document.querySelector(".board-container").style.display="none";
        historyBtn.textContent="Close History"
        for(let i=0;i<allGames.length;i++){
            historyMaker(allGames[i]);
        }
        isHistory=true;
    }
    else{
        document.querySelector(".history-mode").style.display="none";
        document.querySelector(".board-container").style.display="grid";
        historyBtn.textContent="Game History"
        isHistory=false;
    }



}

const historyMaker = (historyArr)=>{
    
}