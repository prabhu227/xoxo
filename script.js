const cells=document.querySelectorAll(".cell");
const statusText=document.querySelector(".status");
const scoreXText=document.getElementById("scoreX");
const scoreOText=document.getElementById("scoreO");
const roundText=document.getElementById("round");

const modeScreen=document.getElementById("modeScreen");
const gameContainer=document.getElementById("gameContainer");

let board=["","","","","","","","",""];
let currentPlayer="X";
let gameMode="pvp";
let gameActive=true;

let round=1;
let maxRounds=10;

let scoreX=0;
let scoreO=0;

const winPatterns=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

function toggleTheme(){
document.body.classList.toggle("dark");
document.body.classList.toggle("light");
}

function startGame(mode){
gameMode=mode;
modeScreen.classList.add("hidden");
gameContainer.classList.remove("hidden");
restartTournament();
}

function goHome(){
modeScreen.classList.remove("hidden");
gameContainer.classList.add("hidden");
}

function restartTournament(){
scoreX=0;
scoreO=0;
round=1;
updateScore();
restartBoard();
}

function updateScore(){
scoreXText.textContent=scoreX;
scoreOText.textContent=scoreO;
roundText.textContent=round;
}

cells.forEach(cell=>{
cell.addEventListener("click",()=>{
let index=cell.getAttribute("data-index");
if(board[index]!==""||!gameActive)return;
if(gameMode==="cpu"&&currentPlayer==="O")return;

makeMove(index,currentPlayer);

if(gameMode==="cpu"&&gameActive){
setTimeout(()=>{
let bestMove=minimax(board,"O").index;
makeMove(bestMove,"O");
},400);
}
});
});

function makeMove(index,player){
board[index]=player;
cells[index].textContent=player;
checkWinner(player);
currentPlayer=player==="X"?"O":"X";
statusText.textContent=`${currentPlayer}'s Turn`;
}

function checkWinner(player){
for(let pattern of winPatterns){
let[a,b,c]=pattern;
if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
cells[a].classList.add("win");
cells[b].classList.add("win");
cells[c].classList.add("win");

celebrate(player);
return;
}
}

if(!board.includes("")){
endRound("Draw 🤝");
}
}

function celebrate(player){
if(player==="X")scoreX+=5;
else scoreO+=5;

endRound(`🏆 ${player} Wins! +5 🎉`);
}

function endRound(message){
gameActive=false;
statusText.textContent=message;

setTimeout(()=>{
if(round>=maxRounds){
endTournament();
}else{
round++;
updateScore();
restartBoard();
}
},1500);
}

function endTournament(){
if(scoreX>scoreO){
statusText.textContent="👑 Player X Wins Tournament!";
}else if(scoreO>scoreX){
statusText.textContent="👑 Player O Wins Tournament!";
}else{
statusText.textContent="Tournament Draw 🤝";
}
}

function restartBoard(){
board=["","","","","","","","",""];
gameActive=true;
currentPlayer="X";
cells.forEach(cell=>{
cell.textContent="";
cell.classList.remove("win");
});
statusText.textContent="X's Turn";
}

function minimax(newBoard,player){
let avail=newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

if(checkWinMini(newBoard,"X"))return{score:-10};
if(checkWinMini(newBoard,"O"))return{score:10};
if(avail.length===0)return{score:0};

let moves=[];

for(let i=0;i<avail.length;i++){
let move={};
move.index=avail[i];
newBoard[avail[i]]=player;

let result=minimax(newBoard,player==="O"?"X":"O");
move.score=result.score;

newBoard[avail[i]]="";
moves.push(move);
}

let bestMove;
if(player==="O"){
let bestScore=-10000;
for(let i=0;i<moves.length;i++){
if(moves[i].score>bestScore){
bestScore=moves[i].score;
bestMove=i;
}
}
}else{
let bestScore=10000;
for(let i=0;i<moves.length;i++){
if(moves[i].score<bestScore){
bestScore=moves[i].score;
bestMove=i;
}
}
}
return moves[bestMove];
}

function checkWinMini(board,player){
return winPatterns.some(pattern=>{
return pattern.every(index=>board[index]===player);
});
}