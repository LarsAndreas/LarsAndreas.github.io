//@ts-check

function setup() {

    const GRIDSIZE = 10;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "red";

    class Ant {

        constructor(direction,x,y) {
            this.d = direction;
            this.x = x;
            this.y = y;
        }

        drawAnt() {
            ctx.fillStyle = "black";
            ctx.fillRect(this.y+4, this.x+4, 2, 2);
        }

        choseDirection() {
            let color = getColor(this.x, this.y, 1, 1);
            if (color == "red") {
                this.d = mod(this.d + 1,4);
            } else {
                this.d = mod(this.d - 1,4);
            }
        }

        goDirection() {
            let color = getColor(this.x,this.y, 1, 1);
            drawColor(this.x, this.y, GRIDSIZE,GRIDSIZE, color);
            switch(this.d) {
                case 0:
                    this.y += 10;
                    break
                case 1:
                    this.x -= 10;
                    break
                case 2:
                    this.y -= 10;
                    break
                case 3:
                    this.x += 10;
                    break
            }
        }
    }

    const mod = (x, n) => (x % n + n) % n

    function getColor(x,y,w,h) {
        var imgData = ctx.getImageData(x, y, w, h);
        let red = imgData.data[0];
        let blue = imgData.data[2];
        if (blue > red) {
            return "red";
        } else if (blue <= red){
            return "blue";
        } 
        //return white
    }

    function drawColor(x,y,w,h,color) {
        ctx.fillStyle = color;
        ctx.fillRect(y, x, w, h);
    }


    ctx.fillStyle = 'red';
    ctx.fillRect(0,0,c.width, c.height);
    let langtonsAnt = new Ant(0,300,300)

    setInterval(() => {
        langtonsAnt.drawAnt();
        langtonsAnt.choseDirection();
        langtonsAnt.goDirection();
        langtonsAnt.drawAnt();
    }, 1000)
}