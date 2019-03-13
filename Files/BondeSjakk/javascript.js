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
}

class Board {
    constructor(canvas,wx,wy) {
        this.canvas = canvas;
        this.board = this.generateBoard(wx,wy);
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

    drawBoard() {
        let cellWidth = (this.canvas.width) / this.board.length;
        this.canvas.ctx.strokeStyle = "black";
        for(let x = 0; x < this.board.length+1; x++) {
            let dx = cellWidth * x;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx,0)
            this.canvas.ctx.lineTo(dx,this.canvas.height);
            this.canvas.ctx.stroke();
        }
        for(let y = 0; y < this.board.length+1; y++) {
            let dy = cellWidth * y;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0,dy)
            this.canvas.ctx.lineTo(this.canvas.width,dy);
            this.canvas.ctx.stroke();
        }
    }

    placeSymbol(x,y,symbol) {
        let cellWidth = (this.canvas.width) / this.board.length
        let dx = cellWidth * x;
        let dy = cellWidth * y;
        if(symbol == "x") {
            this.canvas.ctx.strokeStyle = "#ff0000";
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx,dy)
            this.canvas.ctx.lineTo(dx+cellWidth,dy+cellWidth);
            this.canvas.ctx.stroke();
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(dx+cellWidth,dy)
            this.canvas.ctx.lineTo(dx,dy+cellWidth);
            this.canvas.ctx.stroke();
        } else if(symbol == "o") {

        }
    }
}

function setup() {
    let main = document.getElementById("main");
    let c = new Canvas(main,"Board",500,500);
    c.show();
    let board = new Board(c,20,20)
    board.drawBoard();
    board.placeSymbol(3,3,"x");
    board.placeSymbol(3,3,"o");
}

function update() {

}