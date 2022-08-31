document.addEventListener("DOMContentLoaded" ,()=>{

// golabal variables
var gameBoard = document.querySelector(".game-board");


//make blocks
function makeBlocks(){
	for (var i = 0; i < 210; i++) {
		var block = document.createElement("div");
		block.classList.add("block");
		if (i>199) block.classList.add("ground");
		gameBoard.appendChild(block);
	}
}makeBlocks();
let blocks = Array.from(document.querySelectorAll(".block"));

//make tetrominos
const rowCount = 10;

const jTetromino = [
	[0, rowCount, rowCount*2, 1],
	[rowCount, rowCount+1, rowCount+2, rowCount*2+2],
	[2, rowCount+2, rowCount*2+2, rowCount*2+1],
	[rowCount, rowCount*2, rowCount*2+1, rowCount*2+2]
]
const lTetromino = [
	[0, 1, rowCount+1, rowCount*2+1],
	[rowCount, rowCount+1, rowCount+2, 2],
	[1, rowCount+1, rowCount*2+1, rowCount*2+2],
	[rowCount, rowCount+1, rowCount+2, rowCount*2]
]
const sTetromino = [
	[0,rowCount,rowCount+1,rowCount*2+1],
	[rowCount+1, rowCount+2,rowCount*2,rowCount*2+1],
	[0,rowCount,rowCount+1,rowCount*2+1],
	[rowCount+1, rowCount+2,rowCount*2,rowCount*2+1]
]
const zTetromino = [
	[1,rowCount,rowCount+1,rowCount*2],
	[rowCount, rowCount+1,rowCount*2+1,rowCount*2+2],
	[1,rowCount,rowCount+1,rowCount*2],
	[rowCount, rowCount+1,rowCount*2+1,rowCount*2+2]
]
const tTetromino = [
	[1,rowCount,rowCount+1,rowCount+2],
	[1,rowCount+1,rowCount+2,rowCount*2+1],
	[rowCount,rowCount+1,rowCount+2,rowCount*2+1],
	[1,rowCount,rowCount+1,rowCount*2+1]
]

const oTetromino = [
	[0,1,rowCount,rowCount+1],
	[0,1,rowCount,rowCount+1],
	[0,1,rowCount,rowCount+1],
	[0,1,rowCount,rowCount+1]
]

const iTetromino = [
	[1,rowCount+1,rowCount*2+1,rowCount*3+1],
	[rowCount,rowCount+1,rowCount+2,rowCount+3],
	[1,rowCount+1,rowCount*2+1,rowCount*3+1],
	[rowCount,rowCount+1,rowCount+2,rowCount+3]
]
const theTetrominoes = [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
const colors =["blue" , "orange" , "green" , "#eded32" , "blueviolet" , "red" , "brown"]
//put random tetro on top
	var currentPos = 4;
	var middle = 5;
	var currentRotation = 0;
	var nextRandomShape = 0;
	var randomShape = Math.floor(Math.random()*7);	
	let current = theTetrominoes[randomShape][currentRotation];

function draw(){
	current.forEach(cube =>{
		blocks[cube+currentPos].style.backgroundColor = colors[randomShape];
	});
}
	
function unDraw(){
	current.forEach(cube =>{
		blocks[cube+currentPos].style.backgroundColor = "#fff";
	});
}

//move tetromino Down
function moveTetroDown(){
	unDraw();
	currentPos += rowCount;
	draw();
	freeze();
}
var moveTetroDownInterval = setInterval(moveTetroDown,1000);

//freeze func
function freeze(){
	current.some(cube =>{
		if(blocks[cube+rowCount+currentPos].classList.contains("taken") 
			|| blocks[cube+rowCount+currentPos].classList.contains("ground")){
			current.forEach(cube=>{blocks[cube+currentPos].classList.add("taken") });
			currentPos =4;
			randomShape = nextRandomShape;
			nextRandomShape = Math.floor(Math.random()*7);	
			current = theTetrominoes[randomShape][currentRotation];
			draw();
			removeRow();
			displayMini();
			checkLost();
		}
	});
}

//move tetros every direction
document.addEventListener("keydown",(e)=>{

	if (e.key == "ArrowLeft") {
		moveLeft();
	}
	if (e.key == "ArrowRight") {
		moveRight();
	}
	if (e.key == "ArrowUp") {
		rotate();
	}
	if (e.key == "ArrowDown") {
		moveDown();
	}
});

function moveLeft(){
	unDraw();
	const isTetroInAge = current.some(cube=>(cube+currentPos)%rowCount === 0);
	if (isTetroInAge == false) {currentPos -= 1};
	current.some(cube=>{
		if (blocks[cube+currentPos].classList.contains("taken")) {
			currentPos += 1;
		}
	});
	draw();
}
function moveRight(){
	unDraw();
	const isTetroInAge = current.some(cube=>(cube+currentPos)%rowCount === rowCount-1);
	if (isTetroInAge == false) {currentPos += 1};
	current.some(cube=>{
		if (blocks[cube+currentPos].classList.contains("taken")) {
			currentPos -= 1;
		}
	});
	draw();
}
function moveDown(){
	unDraw();
	currentPos += rowCount;
	draw();
	freeze();
}
function rotate(){
	unDraw();
	currentRotation++;
	if (currentRotation == 4) {currentRotation=0;}	
	current = theTetrominoes[randomShape][currentRotation];

	correctRotatePosition();
	draw();
}

function correctRotatePosition(){
	var rightOutA = current.some(cube=>(cube+currentPos)%rowCount == rowCount-2);
	var rightOutB = current.some(cube=>(cube+currentPos)%rowCount == 0);
	var rightOutC = current.some(cube=>(cube+currentPos)%rowCount == 1);
	if (rightOutA == true && rightOutB == true) { currentPos -= 1}
	if (rightOutA == true && rightOutB == true && rightOutC == true) { currentPos -= 1}
	var leftOutA = current.some(cube=>(cube+currentPos)%rowCount == 1);
	var leftOutB = current.some(cube=>(cube+currentPos)%rowCount == rowCount-1);
	if (leftOutB == true && leftOutA == true) { currentPos += 1}
}

//remove row
var yourScore =0;
var score = document.querySelector("#score");
function removeRow(){
	for (var i = 0; i < 200; i+=rowCount) {
		const row = [i ,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
		if (row.every(index=> blocks[index].classList[1] === "taken")) {
			yourScore += 10;
			score.innerText = yourScore;
			row.forEach(index=>{
				blocks[index].classList.remove("taken");
				blocks[index].style.backgroundColor = "#fff";
			});
	        const blocksRemoved = blocks.splice(i, rowCount)
	        blocks = blocksRemoved.concat(blocks);
	        blocks.forEach(cube => gameBoard.appendChild(cube))
		}
	}
}

//next piece
let miniGrid = Array.from(document.querySelectorAll(".next div"));

  //show up-next tetromino in mini-grid display
  const displayWidth = 4


  //the Tetrominos first rotations
  const nextTetrominoes = [
    [0, 1, displayWidth+1, displayWidth*2+1], //ltetromino
    [1, displayWidth+1, displayWidth*2+1, 2], //jTetromino
    [1,displayWidth,displayWidth+1,displayWidth*2], // ztetromino
    [0,displayWidth,displayWidth+1,displayWidth*2+1], //sTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [displayWidth+1, displayWidth+2, displayWidth*2+1,displayWidth*2+2], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

function displayMini(){
	miniGrid.forEach(cube=>{
		cube.style.backgroundColor = "#fff";
	})

	nextTetrominoes[nextRandomShape].forEach(index=>{
		miniGrid[index].style.backgroundColor = colors[nextRandomShape];
	})
}

//game over
function checkLost(){
	for (var i = 0; i < 30; i++) {
		if (blocks[i].classList[1] =="taken") {
			var massage = document.querySelector(".state");
			clearInterval(moveTetroDownInterval);
			massage.innerHTML = "Game Over !";
		}
	}
}


});