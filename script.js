
//in ai vs ai, sometimes it thinks random is minimax

//make a div that takes half the space of the player info rectangle and it shifts at the turn


//if reset board and ai vs ai, doesn't work unless click ai from menu again
//solution could be - if ai vs ai and turn is 1. reset btn displays "Fight robots!" instead of reset board


//try setting settimeout in minimax and not move router

//modify scroll bar

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
            if(checkPlayerType()[0].includes("AI") && checkPlayerType()[1].includes("AI")){
                if(!document.querySelector("AI-btn")){
                    const aiBtn = document.createElement("button")
                    aiBtn.innerText = "AI Fight!"
                    aiBtn.classList.add("AI-btn");
                    document.querySelector(".info-container").append(aiBtn)
                    aiBtn.addEventListener("click",()=>{
                        aiBtn.style.display="none";
                        createBoard()
                        menuRouter()
                    }, {once:true} )
                }

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
            let winner = checkPattern(indexBoard, player);
            declareWinner(winner);
            moveHistory.push(detectWinnerName(winner.mark), winner.indexOfWin)
            allGames.push(moveHistory)
        }
        else if(turn>9){ //tie
            moveHistory.push("tie")
            allGames.push(moveHistory)
            declareWinner(null);
            return;
        }

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
    if(e.target.textContent==="Github"){
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
        const historyGrid = document.querySelector(".history-mode");
        historyGrid.innerHTML="";
        historyGrid.style.display="grid";
        document.querySelector(".board-container").style.display="none";
        historyBtn.textContent="Close History"
        for(let i=0;i<allGames.length;i++){
            let cutArr = 0, winner, winPattern;
            if(allGames[i][allGames[i].length-1]!=="tie"){
                winner = allGames[i][allGames[i].length-2];
                winPattern = allGames[i][allGames[i].length-1];
                cutArr=2;
            }
            else {cutArr=1};
            const moves = [...allGames[i]];
            moves.splice(moves.length-cutArr, cutArr)
            let row = historyFactory(moves, winner, winPattern, i);
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
const historyFactory = (moves, winner, winPattern, index)=>{
    const gameMoves = moves;
    const gameWinner = winner;
    const pattern = winPattern;
    const container = document.querySelector(".history-mode");
    const littleContainer = document.createElement("div")
    const row = document.createElement("div");
    const text = document.createElement("p");
    const playBtn = document.createElement("img");
    const speedBtn = document.createElement("span");
    speedBtn.classList.add("speed-btn");
    speedBtn.innerText = "1x"
    text.innerText = gameWinner===undefined?"Tie Game":`${winner} wins!`;
    playBtn.setAttribute("src", "icons/play.svg");
    playBtn.classList.add(`btn-${index}`)
    row.classList.add("history-row");
    littleContainer.classList.add("little-container");
    for(let i=0;i<9;i++){
        const miniSquare = document.createElement("div");
        miniSquare.classList.add("mini-square");
        littleContainer.appendChild(miniSquare);
    }
    row.appendChild(littleContainer);
    row.appendChild(text);
    row.appendChild(playBtn)    
    row.appendChild(speedBtn);
    container.prepend(row)
    boardMarks(littleContainer, pattern);
    let speedState=0;
    let speed = 500;
    speedBtn.addEventListener("click", speedFunc);
    function speedFunc(){
        switch(speedState){
            case 0:
                speedBtn.innerText="2x"; speedState=1; speed=250;
                break;
            case 1:
                speedBtn.innerText="4x"; speedState=2; speed=125;
                break;
            case 2:
                speedBtn.innerText="1x"; speedState=0; speed = 500;
        }
    }

    
    playBtn.addEventListener("click", replayRoute);
    function replayRoute(){replayGame(littleContainer, pattern, speed)}
    function boardMarks(container, pattern){
        container.querySelectorAll(".mini-square").forEach((elem,i)=>{
            if(pattern!==undefined){
                if(i===pattern[0]||i===pattern[1]||i===pattern[2]){
                    elem.style.background="red"
                }
            }
            for(let x=0;x<gameMoves.length;x++){
                if(i===gameMoves[x].id){
                    elem.textContent=moves[x].mark;
                }
            }
        })
    }
    function replayGame(container, pattern, speed){
        playBtn.removeEventListener("click", replayRoute);
        speedBtn.removeEventListener("click", speedFunc);
        speedBtn.style.opacity="0.3"
        playBtn.style.opacity="0.3"
        container.querySelectorAll(".mini-square").forEach((elem, index)=>{
            elem.innerText="";
            elem.style.background="";
            let timer;
            gameMoves.forEach((arrElem, arrInd)=>{
                if(gameMoves[arrInd].id ===index){
                    timeSquare(arrInd);
                }
            })
            function timeSquare(arrInd){
                timer = setTimeout(()=>{
                    elem.innerText=gameMoves[arrInd].mark;
                    if(arrInd===gameMoves.length-1){
                        boardMarks(container, pattern);
                        clearTimeout(timer);
                        playBtn.addEventListener("click", replayRoute);
                        speedBtn.addEventListener("click", speedFunc);
                        playBtn.style.opacity="1"
                        speedBtn.style.opacity="1";
                    }
                },speed*arrInd)
            }
        })
    }
    return {}
}


