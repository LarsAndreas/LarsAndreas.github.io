//@ts-check

function setup() {

    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;

    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");

    c.width = WIDTH;
    c.height = HEIGHT;

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y; 
        }

        draw(radius) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius-1, 0, 2 * Math.PI);
            ctx.fill();
        }

        add(point) {
            return new Point(this.x + point.x, this.y + point.y);
        }
    }

    class Mouse {
        constructor() {
            this.pos;
        }

        position(e) {
            this.pos = new Point(e.clientX,e.clientY);
        }

        drawMouse() {
            this.pos.draw(5);
        }
    }

    class Square {
        constructor(position, size) {
            this.angle = 0;
            this.size = size;
            this.center = position;
        }

        get cordinates() {

            function addOffset(primeAngle,angle,center,size) {
                return center.add(new Point(Math.cos(primeAngle + angle)*size,Math.sin(primeAngle + angle)*size));
            }

            let pointA = addOffset(this.angle,0,this.center,this.size);
            let pointB = addOffset(this.angle,Math.PI/2,this.center,this.size);
            let pointC = addOffset(this.angle,Math.PI,this.center,this.size);
            let pointD = addOffset(this.angle,3*Math.PI/2,this.center,this.size);

            return [pointA,pointB,pointC,pointD];
        }

        drawSquare() {
            ctx.strokeStyle = "white";
            for (let i = 1; i < this.cordinates.length; i++) {
                ctx.beginPath()
                ctx.moveTo(this.cordinates[i-1].x,this.cordinates[i-1].y);
                ctx.lineTo(this.cordinates[i].x,this.cordinates[i].y);
                ctx.stroke();
            }
            ctx.beginPath()
            ctx.moveTo(this.cordinates[3].x,this.cordinates[3].y);
            ctx.lineTo(this.cordinates[0].x,this.cordinates[0].y);
            ctx.stroke();
        }
    } 
    function update() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        c.width = WIDTH;
        c.height = HEIGHT;

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,WIDTH,HEIGHT);
    }

    let m = new Mouse();
    let n = new Square(new Point(200,200),100);
    c.addEventListener("mousemove", (event) => {
        m.position(event)
        console.log(m.pos);
        update();
        m.drawMouse();
        n.drawSquare();
        n.angle += 0.01*Math.PI
    })
}
