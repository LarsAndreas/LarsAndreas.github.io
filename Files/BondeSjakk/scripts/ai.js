//@ts-check

class Tiles {
    constructor(board) {
        this.board = board;
        this.valueBoard = this.evaluateTiles(this.board);
    }

    evaluateTile(x,y,board) {

    }

    evaluateTiles(board) {
        let width = this.board.length;
        let height = this.board[0].length;
        let boardVal = Array(width).fill(0).map(x => Array(height).fill(1));
        for(let x = 0; x < boardVal.length; x++) {
            for(let y = 0; y < boardVal.length; y++) {
                boardVal[x][y] = this.evaluateTile(x,y,this.board);
            }
        }
    }
}