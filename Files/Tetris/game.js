//@ts-check

function setup() {
    const SIZE = 30

    const GameWidth = 10;
    const GameHeight = 20;

    const PIECEVARIANT = ["I","L","J","Z","S"]

    const WIDTH = GameWidth*SIZE + (GameWidth-1);
    const HEIGHT = GameHeight*SIZE + (GameHeight-1);

    let c = document.getElementById("game");
    let ctx = c.getContext("2d");

    c.width = WIDTH;
    c.height = HEIGHT;

    class Tetromino {
        constructor(piece) {
            this.piece = this.generate(piece);
        }

        generate(piece) {
            if(piece == "I") {
                return [[[5,0],[5,1],[5,2],[5,3]],"lightblue"];
            } else if(piece == "L") {
                return [[[4,0],[4,1],[4,2],[5,2]],"blue"];
            } else if(piece == "J") {
                return [[[5,0],[5,1],[5,2],[4,2]],"orange"];
            } else if(piece == "Z") {
                return [[[5,0],[5,1],[4,1],[4,2]],"red"];
            } else if(piece == "S") {
                return [[[4,0],[4,1],[5,1],[5,2]],"green"];
            } else if(piece == "T") {
                return [[[4,1],[5,2],[4,2],[3,2]],"purple"]
            }
        }


        impliment(board) {
            this.piece[0].forEach((e) => {
                board[e[0]][e[1]] = this.piece[1];
            })
        }

        moveDown(board) {
            this.piece[0].forEach((pos) => {
                pos[1]++
            })
        }
    }

    class TetrisGame {
        constructor() {
            this.board = this.generateBoard();
            this.pieces = [];
        }

        generateBoard() {
            return Array.from(Array(GameWidth), _ => Array(GameHeight).fill("black"));
        }

        drawBackground() {
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,WIDTH,HEIGHT);
        }

        drawGridLines() {
            ctx.strokeStyle = "rgba(90,90,90,0.5)";
            for(let i = 1; i < GameWidth; i++) {
                ctx.beginPath();
                ctx.moveTo((SIZE+1)*i,0);
                ctx.lineTo((SIZE+1)*i,HEIGHT);
                ctx.stroke();
            }
            for(let i = 1; i < GameHeight; i++) {
                ctx.beginPath();
                ctx.moveTo(0, (SIZE+1)*i);
                ctx.lineTo(WIDTH, (SIZE+1)*i);
                ctx.stroke();
            }
        }

        drawCell(x,y,color) {
            ctx.fillStyle = color;
            let widthX = x * (SIZE + 1);
            let heightY = y * (SIZE + 1);
            ctx.fillRect(widthX,heightY,SIZE,SIZE);
        }

        drawTetriminos() {
            this.pieces.forEach(tetromino => {
                tetromino.impliment(this.board);
            })

            this.board.forEach((col,x) => {
                col.forEach((row,y) => {
                    this.drawCell(x,y,row);
                })
            })
        }

        draw() {
            this.drawBackground();
            this.drawGridLines();
            this.drawTetriminos();
        }

        update() {
            this.board = this.generateBoard();
            this.draw();
            if(a % 200/dt == 0) {
                this.pieces.forEach( piece => piece.moveDown());
            }
            a++
        }
    }

    let a = 0;
    let dt = 1;

    let game = new TetrisGame();
    game.pieces.push(new Tetromino("Z"));
    setInterval(()=>{game.update()},dt);
    /**
     *    game.drawBackground();
     *    game.drawGridLines();
     *    game.drawCell(0,0,"red");
     */

}