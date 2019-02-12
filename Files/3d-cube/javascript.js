//@ts-check

function setup() {

    let c = document.getElementById("cube");
    let ctx = c.getContext("2d");

    const WIDTH = 1000;
    const HEIGHT = 500;

    c.width = WIDTH;
    c.height = HEIGHT;

    class Point {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z || 0;
        }
    }

    class Cube {
        constructor(pointA, pointB) {
            this.pointA = pointA;
            this.pointB = pointB;
            this.angle = 2 * Math.PI / 3
        }

        get sides() {
            let sides = [];
            sides.push([this.pointA, this.pointB]);
            sides.push([this.pointA, new Point(this.pointB.x, this.pointB.y - this.pointA.y, this.pointB.z - this.pointA.z)]);
            sides.push([this.pointA, new Point(this.pointB.x - this.pointA.x, this.pointB.y, this.pointB.z - this.pointA.z)]);
            return sides;
        }

        drawSquare(pointA, pointB) {
            ctx.fillStyle = "black";
            ctx.fillRect(pointA.x, pointB.y, pointB.x - pointA.x, pointB.y - pointA.y);
            ctx.fillStyle = "red";
            ctx.fillRect(pointA.x + 1, pointB.y + 1, pointB.x - pointA.x - 2, pointB.y - pointA.y - 2);
        }

    }
    let cubeA = new Cube(new Point(50, 50, 0), new Point(100, 100, 50));
    cubeA.drawCube();
}