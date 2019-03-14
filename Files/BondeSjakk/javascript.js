//@ts-check

class Display {
    constructor(parent) {
        this.p = parent;
    }

    show() {
        this.p.appendChild(this.div)
    }
}

class Canvas extends Display {
    constructor(parent, id, width, height) {
        super(parent);
        this.width = width;
        this.height = height;
        this.div = this.makeCanvas(id, width, height);
        this.ctx = this.div.getContext("2d");
    }

    makeCanvas(id, width,height) {
        let div = document.createElement("canvas");
        div.id = id;
        div.width = width;
        div.height = height;
        return div;
    }

    fillWhite() {
        this.ctx.fillStyle = "white";
        this.ctx.rect(0,0,this.width,this.height);
        this.ctx.fill();
    }
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y; 
    }
}

class Mouse {
    constructor(canvas, cellWidth) {
        this.pos;
        this.canvas = canvas;
        this.changeFlag = false;
        this.cellwidth = cellWidth;
        this.addUpdater();
    }

    updatePosition(e) {
        let x = Math.floor(e.clientX / (this.cellwidth +1));
        let y = Math.floor(e.clientY / (this.cellwidth +1));
        this.pos = new Point(x,y);
        this.changeFlag = true;
    }

    addUpdater() {
        document.addEventListener("mousedown", (event) => {
            this.updatePosition(event);
        });
    }
}

class Board {
    constructor(canvas,wx,wy) {
        this.canvas = canvas;
        this.board = this.generateBoard(wx,wy);
        this.cellWidth = (this.canvas.width) / this.board.length;
    }

    generateBoard(wx,wy) {
        let board = [];
        for(let i = 0; i < wx; i++) {
            let col = [];
            for(let j = 0; j < wy; j++) {
                col.push(-1);
            }
            board.push(col);
        }
        return board
    }

    drawBoardLines() {
        this.cellWidth = (this.canvas.width) / this.board.length;
        this.canvas.ctx.strokeStyle = "black";
        for(let x = 0; x < this.board.length+1; x++) {
            let dx = this.cellWidth * x;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx,0)
            this.canvas.ctx.lineTo(dx,this.canvas.height);
            this.canvas.ctx.stroke();
        }
        for(let y = 0; y < this.board.length+1; y++) {
            let dy = this.cellWidth * y;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0,dy)
            this.canvas.ctx.lineTo(this.canvas.width,dy);
            this.canvas.ctx.stroke();
        }
    }

    drawBoard() {
        for(let x = 0; x < this.board.length; x++) {
            for(let y = 0; y < this.board[x].length; y++) {
                if(this.board[x][y] == 0) {
                    this.drawSymbol(x,y,"x");
                } else if(this.board[x][y] == 1) {
                    this.drawSymbol(x,y,"o");
                }
            }
        }
    }

    placeSymbol(x,y,symbol) {
        if(symbol == "x") {
            this.board[x][y] = 1
        } else if(symbol == "o") {
            this.board[x][y] = 2
        }
    }

    drawSymbol(x,y,symbol) {
        let cellWidth = (this.canvas.width) / this.board.length
        let dx = cellWidth * x;
        let dy = cellWidth * y;
        let dw = 2;
        if(symbol == "x") {
            this.canvas.ctx.strokeStyle = "#ff0000";
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx+dw,dy+dw)
            this.canvas.ctx.lineTo(dx+cellWidth-dw,dy+cellWidth-dw);
            this.canvas.ctx.stroke();
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx+cellWidth-dw,dy+dw)
            this.canvas.ctx.lineTo(dx+dw,dy+cellWidth-dw);
            this.canvas.ctx.stroke();
        } else if(symbol == "o") {
            this.canvas.ctx.strokeStyle = "#0000ff";
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(dx+cellWidth/2,dy+cellWidth/2,cellWidth/2 - 1,0,Math.PI * 2)
            this.canvas.ctx.stroke();
        }
    }
}

//https://stackoverflow.com/questions/37103732/optimize-genetic-neural-network-resolving-tic-tac-toe

function setup() {
    let main = document.getElementById("main");
    let c = new Canvas(main,"Board",500,500);
    c.show();
    let board = new Board(c,15,15)
    let mouse = new Mouse(c,board.cellWidth);
    window.requestAnimationFrame(() => update(c,board,mouse,0));
}

function update(canvas, board, mouse, counter) {
    if(mouse.changeFlag == true) {
        if (counter == 0) {
            board.board[mouse.pos.x][mouse.pos.y] = 0;
        } else {
            board.board[mouse.pos.x][mouse.pos.y] = 1;
        }
        counter = (counter + 1) % 2
        mouse.changeFlag = false;
    }
    canvas.fillWhite();
    board.drawBoardLines();
    board.drawBoard();
    window.requestAnimationFrame(() => update(canvas,board,mouse,counter));
}