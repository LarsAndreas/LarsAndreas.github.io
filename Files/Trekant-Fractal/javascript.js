//@ts-check

function setup() {
    let c = document.getElementById("cube");
    let ctx = c.getContext("2d");


    let inpIteration = document.getElementById("iteration");
    let max;
    
    inpIteration.addEventListener("mouseup",update);

    const WIDTH = 1000;
    const HEIGHT = 500;

    c.width = WIDTH;
    c.height = HEIGHT;


    class Vector {
        constructor(dx,dy) {
            this.dx = dx;
            this.dy = dy;
        }

        get length() {
            return Math.sqrt(this.dx**2 + this.dy**2);
        }

        add(value) {
            if (value instanceof Vector) {
            this.dx += value.dx;
            this.dy += value.dy;
            }
        }

        scale(value) {
            this.dx *= value;
            this.dy *= value;
        }

        rotate(v) {
            let u = Math.atan(this.dy/this.dx);
            let l = this.length
            this.dx = Math.cos((Math.PI * (v)/180) + u) * l
            this.dy = Math.sin((Math.PI * (v)/180) + u) * l
        }
    }

    class Triangle {
        constructor(pointA,pointB,pointC, iteration) {
            this.A = pointA;
            this.B = pointB;
            this.C = pointC;
            this.i = iteration;
        }

        drawTriangle() {
            ctx.lineWidth = (1/3)**(this.i / 3)
            ctx.beginPath();
            ctx.moveTo(this.A.x, this.A.y);
            ctx.lineTo(this.B.x, this.B.y);
            ctx.lineTo(this.C.x, this.C.y);
            ctx.lineTo(this.A.x, this.A.y);
            ctx.stroke();
        }

        get centroid() {
            return {x: (this.A.x + this.B.x + this.C.x)/3, y: (this.A.y + this.B.y + this.C.y)/3}
        }

        get nextTriangels() {
            return [new Triangle(this.A,this.B,this.centroid, this.i + 1), new Triangle(this.A,this.C,this.centroid, this.i + 1),new Triangle(this.B,this.C,this.centroid, this.i + 1)]
        }

        drawNextTriangles() {
            let it = this.i;
            this.nextTriangels.forEach(function(a) {
                if(it < max) {
                    a.drawNextTriangles();
                } else {
                    a.drawTriangle();
                }
            });
        }
    }

    class EquilateralTriangle extends Triangle {
        constructor(pointA,pointB,iteration) {
            super(pointA,pointB)
            this.i = iteration;
            this.C = this.pointC;
        }
        
        get pointC() {
            let vec = new Vector(this.B.x-this.A.x,this.B.y-this.A.y);
            vec.rotate(-60);
            vec.add(new Vector(this.A.x,this.A.y));
            let C = {x: vec.dx,y: vec.dy};
            return C;
        }
    }


    function update() {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        max = Number(inpIteration.value);
        let triangle = new EquilateralTriangle({x:300,y:400}, {x:700,y:400}, 0);
        triangle.drawTriangle();
        triangle.drawNextTriangles();
    }

    let triangle = new EquilateralTriangle({x:300,y:400}, {x:700,y:400}, 0);
    triangle.drawTriangle();
}
