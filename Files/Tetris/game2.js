//@ts-check

//Constants
const PIECEVARIANTS = ["I", "L", "J", "Z", "S", "T", "O"];


//Gameplay
let AI = true;

class BoardCanvas {
    constructor(cellSize, gameWidth, gameHeight) {
        this.cSize = cellSize;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.c = this.makeCanvas();
        this.ctx = this.c.getContext("2d");
    }

    makeCanvas() {

        // celler + gridlinjer
        const WIDTH = this.gameWidth * this.cSize + (this.gameWidth - 1);
        const HEIGHT = this.gameHeight * this.cSize + (this.gameHeight - 1);

        let canvasElm = document.createElement("canvas");

        canvasElm.width = WIDTH;
        canvasElm.height = HEIGHT;

        return canvasElm;
    }
}

class Tetromino {
    constructor(shape) {
        this.pieceCells = this.generate(shape);
        this.tetrominoShape = shape;
        this.state = "O";
    }

    generate(pieceCells) {
        if (pieceCells == "I") {
            return [[[4, 0], [4, 1], [4, 2], [4, 3]], "lightblue"];
        } else if (pieceCells == "L") {
            return [[[3, 0], [3, 1], [3, 2], [4, 2]], "blue"];
        } else if (pieceCells == "J") {
            return [[[4, 0], [4, 1], [4, 2], [3, 2]], "orange"];
        } else if (pieceCells == "Z") {
            return [[[3, 0], [3, 1], [4, 1], [4, 2]], "red"];
        } else if (pieceCells == "S") {
            return [[[4, 0], [4, 1], [3, 1], [3, 2]], "green"];
        } else if (pieceCells == "T") {
            return [[[4, 0], [3, 1], [4, 1], [5, 1]], "purple"];
        } else if (pieceCells == "O") {
            return [[[4, 0], [5, 0], [4, 1], [5, 1]], "yellow"];
        }
    }

    placeTetromino(board, color) {
        this.pieceCells[0].forEach(cell => {
            board.change(cell[0], cell[1], color || this.pieceCells[1]);
        })
    }
}


/**
 * Teorien bak Bag:
 * https://tetris.fandom.com/wiki/Random_Generator
*/
class Bag {
    constructor() {
        this.getRandomTetrominos();
    }

    getRandomTetrominos() {
        let pieces = PIECEVARIANTS.slice(0);
        pieces.sort(() => Math.random() - 0.5)
        this.tetrominos = pieces;
    }

    update() {
        this.tetrominos.shift();
        if (this.tetrominos.length == 0) {
            this.getRandomTetrominos();
        }
    }
}

/** 
 * https://tetris.wiki/SRS
*/
class SRS {
    constructor() {

    }

    static NormalRotate(tetromino, direction) {
        if(direction == "R") {
            let newCells = [];
            tetromino.pieceCells[0].forEach(cell => {
                let newCell = [];
                newCell.push(cell[1]);
                newCell.push(cell[0])
                newCells.push(newCell)
            })
            tetromino.pieceCells[0] = newCells;
            return tetromino;
        }
    }

    static SRSRotate(tetromino,direction) {
        const RotationCycle = ["O","R","2","L"];
        let rotation = tetromino.rotationState;
        if(direction == "R") {
            let index = RotationCycle.indexOf(rotation);
            index = (index + 1) % RotationCycle.length;
            tetromino.rotationState = RotationCycle[index];


        } else {
            let index = RotationCycle.indexOf(rotation);
            index = (index + 1 + RotationCycle.length) % RotationCycle.length;
            tetromino.rotationState = RotationCycle[index];


        }

        return tetromino;
    }
}

class Hand {
    constructor(bag, board) {
        this.bag = bag;
        this.board = board;
        this.tetromino;
    }

    currentHand() {
        let current = this.bag.tetrominos[0];
        this.bag.update();
        return current;
    }

    spawnTetromino() {
        let tetromino = this.currentHand();
        this.tetromino = new Tetromino(tetromino);
        this.previoustetromino = this.tetromino; //might cause bug
        this.tetromino.placeTetromino(this.board);
    }

    goDown() {
        if(this.rotationFlag != true) {
            if (this.checkDown() == true) {
                this.previoustetromino.placeTetromino(this.board, "black");
                this.tetromino.pieceCells[0].forEach((cell) => {
                    cell[1]++
                });
            } else {
                this.spawnTetromino();
            }
    
            this.previoustetromino = this.tetromino;
            this.tetromino.placeTetromino(this.board);
        } else {
            this.rotationFlag = false;
        }
    }

    updateGoDirection() {
        if (this.moveFlag != false) {
            if (this.moveFlag == "left") {
                if (this.checkLeft() == true) {
                    this.previoustetromino.placeTetromino(this.board, "black");
                    this.tetromino.pieceCells[0].forEach(cell => {
                        cell[0]--
                    })
                }
            } else if (this.moveFlag == "right") {
                if (this.checkRight() == true) {
                    this.previoustetromino.placeTetromino(this.board, "black");
                    this.tetromino.pieceCells[0].forEach(cell => {
                        cell[0]++
                    })
                }
            }
            this.moveFlag = false;
        }

        this.previoustetromino = this.tetromino;
        this.tetromino.placeTetromino(this.board);
    }

    checkDirection(rowCol, sorter, dx, dy) {
        let tetorminos = this.tetromino.pieceCells[0].slice(0);

        let splitRowOrCol = {};


        tetorminos.forEach((cell) => {
            if (Object.keys(splitRowOrCol).includes(String(cell[rowCol]))) {
                splitRowOrCol[cell[rowCol]].push(cell)
            } else {
                splitRowOrCol[cell[rowCol]] = [];
                splitRowOrCol[cell[rowCol]].push(cell);
            }
        })

        let splitArray = Object.values(splitRowOrCol);

        let checkCells = [];
        let inverse = (rowCol + 1) % 2;
        splitArray.forEach(list => {
            let sortByDirection = list.sort((a, b) => (a[inverse] - b[inverse]) * sorter);
            checkCells.push(sortByDirection[0]);
        });
        try {
            for (let i = 0; i < checkCells.length; i++) {
                if (this.board.boardCells[checkCells[i][0] + dx][checkCells[i][1] + dy] != "black") {
                    return false;
                }
            }
            return true;
        } catch {
            return false;
        }
    }

    checkLeft() {
        return this.checkDirection(1, 1, -1, 0);
    }

    checkRight() {
        return this.checkDirection(1, -1, 1, 0);
    }

    checkDown() {
        return this.checkDirection(0, -1, 0, 1);
    }

    move(direction) {
        this.moveFlag = direction;
    }
}

class Board {
    constructor(canvas) {
        this.canvas = canvas || new BoardCanvas(30, 10, 20);
        this.boardCells = Array.from(Array(this.canvas.gameWidth), _ => Array(this.canvas.gameHeight).fill("black"));
    }

    change(x, y, value) {
        this.boardCells[x][y] = value;
    }

    drawGridLines() {
        const WIDTH = this.canvas.gameWidth * this.canvas.cSize + (this.canvas.gameWidth - 1);
        const HEIGHT = this.canvas.gameHeight * this.canvas.cSize + (this.canvas.gameHeight - 1);

        this.canvas.ctx.strokeStyle = "rgba(90,90,90,0.5)";
        for (let i = 1; i < this.canvas.gameWidth; i++) {
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo((this.canvas.cSize + 1) * i, 0);
            this.canvas.ctx.lineTo((this.canvas.cSize + 1) * i, HEIGHT);
            this.canvas.ctx.stroke();
        }
        for (let i = 1; i < this.canvas.gameHeight; i++) {
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0, (this.canvas.cSize + 1) * i);
            this.canvas.ctx.lineTo(WIDTH, (this.canvas.cSize + 1) * i);
            this.canvas.ctx.stroke();
        }
    }

    drawBackground() {
        const WIDTH = this.canvas.gameWidth * this.canvas.cSize + (this.canvas.gameWidth - 1);
        const HEIGHT = this.canvas.gameHeight * this.canvas.cSize + (this.canvas.gameHeight - 1);

        this.canvas.ctx.fillStyle = "black";
        this.canvas.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    drawCell(x, y, color) {
        this.canvas.ctx.fillStyle = color;
        let widthX = x * (this.canvas.cSize + 1);
        let heightY = y * (this.canvas.cSize + 1);
        this.canvas.ctx.fillRect(widthX, heightY, this.canvas.cSize, this.canvas.cSize);
    }

    drawBoard() {
        this.boardCells.forEach((col, x) => {
            col.forEach((row, y) => {
                this.drawCell(x, y, row);
            })
        })
    }

    draw() {
        this.drawBackground();
        this.drawGridLines();
        this.drawBoard();
    }
}

class Game {
    constructor() {

    }
}

class Replay {
    constructor() {

    }
}

class PerfectFiness {
    constructor() {

    }
}

class GeneticAlgoritm {
    constructor() {

    }
}

class NeuralNetwork {
    constructor() {

    }
}

class NeatAlgorithm {
    constructor() {

    }
}

function setup() {
    let div = document.getElementById("game");
    let canvas = new BoardCanvas(30, 10, 20)
    div.appendChild(canvas.c);
    let board = new Board(canvas);
    let bag = new Bag();
    let hand = new Hand(bag, board)
    hand.spawnTetromino();


    let dt = 0;
    setInterval(() => {
        board.draw();
        if (dt % 30 == 0) {
            hand.goDown();
        }

        if (dt % 500 == 132) {
            hand.rotationFlag = true;
            hand.tetromino = SRS.NormalRotate(hand.tetromino,"R");
        } 
        hand.updateGoDirection();
        dt++
    }, 1)



    window.addEventListener("keydown", (e) => {
        if (e.key == "ArrowRight") {
            hand.move("right");
        } else if (e.key == "ArrowLeft") {
            hand.move("left");
        }
    })
}

function update() {

}