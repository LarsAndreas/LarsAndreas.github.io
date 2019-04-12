//@ts-check

class Circle {
    constructor(x,y,radius) {
        this.x = x;
        this.y = y;
        this.r = radius;
    }

    distance2(x,y) {
        return (this.x - x)**2 + (this.y - y)**2;
    }

    placeCircle(board) {
        for(let x = 0; x < board.array.length; x++) {
            for(let y = 0; y < board.array[x].length; y++) {
                board.array[x][y] += this.r**2 / this.distance2(x,y)
            }
        }
    }
}

class Board {
    constructor(ctx, width, height, threshold) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.array = this.board;
        this.threshold = threshold;
    }

    refresh() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }


    drawBoard() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.array[x][y] > this.threshold) {
                    this.ctx.fillStyle = `rgb(${200},${20},${160})`;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    get board() {
        let board = [];
        for(let x = 0; x < this.width; x++) {
            board.push([]);
            for(let y = 0; y < this.height; y++) {
                board[x].push(0);
            }
        }
        return board;
    }
}

function setup() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    let board = new Board(ctx,width, height, 1);
    let A = new Circle(500,250,50);
    let B = new Circle(500,250,50);

    canvas.addEventListener("mousemove", (e) => {
        let x = e.clientX;
        let y = e.clientY;
        A.x = x;
        A.y = y;
    });

    function update() {
        board.array = board.board;
        board.refresh();
        A.placeCircle(board);
        B.placeCircle(board);
        board.drawBoard();
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update)
}