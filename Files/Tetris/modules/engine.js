export default class BoardCanvas {
    constructor(cellSize,gameWidth,gameHeight) {
        this.cSize = cellSize;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.c = this.makeCanvas();
        this.ctx = this.c.getContext("2d");
    }

    makeCanvas() {

        // celler + gridlinjer
        const WIDTH = this.gameWidth*this.cSize + (this.gameWidth-1);
        const HEIGHT =  this.gameHeight*this.cSize + (this.gameHeight-1);
    
        let canvasElm = document.createElement("canvas");
    
        canvasElm.width = WIDTH;
        canvasElm.height = HEIGHT;

        return canvasElm;
    }
}
