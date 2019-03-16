//@ts-check

function setup() {
    let main = document.getElementById("main");
    let c = new Canvas(main,"Board",500,500);
    let board = new Board(c,15,15)
    let mouse = new Mouse(c,board.cellWidth);
    window.requestAnimationFrame(() => {
        update(c,board,mouse)
    });
}


function update(canvas, board, mouse) {
    mouse.drawOnBoard(board);
    board.checkGameOver(mouse);
    canvas.fillWhite();
    board.draw();
    window.requestAnimationFrame(() => {
        update(canvas,board,mouse)
    });
}