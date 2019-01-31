//@ts-check

function setup() {

    const GRIDSIZE = 10;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, c.width, c.height);


    /**
     * 
     * @param {Number} px deler pixlene på GRIDSIZE, slik at vi kan får et kart over de nødvendige pixlene på sjermen
     */
    function normalizeCells(px) {
        return Math.floor(px/GRIDSIZE);
    }

    /** 
     * lager et Global kart over alle cellene på sjermen .
     * Det er globalt, fordi hvis vi har flere maur trenger vi ikke å lagre flere kopier av "kartet".
     */
    let screen = new Array(normalizeCells(c.width)).fill(new Array(normalizeCells(c.height)).fill(0));

    class Ant {

        constructor(direction,x,y) {
            this.d = direction;
            this.x = x;
            this.y = y;
        }

        getColor() {
            // let imgData = ctx.getImageData(this.x,this.y,1,1);
            let color = screen[this.x][this.y];
            if (color == 1) {
                return "blue";
            } else {
                return "red";
            }
        }

        drawAnt() {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+4, this.y+4, 2, 2);
        }

        changeSquare() {
            const COLOR = this.getColor();
            ctx.fillStyle = COLOR;
            ctx.fillRect(this.x, this.y, GRIDSIZE, GRIDSIZE);
        }

        getDirection() {
            let color = this.getColor();
            if (color == "red") {
                this.d = ((this.d - 1) + 4) % 4;
            } else {
                this.d = ((this.d + 1) + 4) % 4;
            }
        }

        moveDirection() {
            switch(this.d) {
                case 0:
                    this.y -= GRIDSIZE
                    break
                case 1:
                    this.x -= GRIDSIZE
                    break
                case 2:
                    this.y += GRIDSIZE
                    break
                case 3:
                    this.x += GRIDSIZE
                    break
            }
        }

        update() {
            this.getDirection()
            this.changeSquare();
            this.moveDirection()
            this.drawAnt();
        }
    }

    let ants = [];
    for(let i = 0; i < 1; i++) {
        ants.push(new Ant(0,10,10));
    }

    setInterval(()=>{
        ants.forEach((e)=>e.update());
    },1)
}