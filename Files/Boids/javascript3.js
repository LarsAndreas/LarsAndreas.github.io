//@ts-check

const WIDTH = 1000;
const HEIGHT = 500;

let boids = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    get length() {
        return Math.sqrt(this.dx ** 2 + this.dy ** 2);
    }

    static createVector(pointA, pointB) {
        return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
    }

    calculateAngle(vector) {
        if (this.length == 0) {
            return undefined;
        } else {
            let angle = Math.acos((this.dx * vector.dx + this.dy * vector.dy) / (this.length * vector.length));
            if (this.dy >= 0) {
                this.angle = angle;
                return angle;
            } else {
                this.angle = -angle;
                return -angle;
            }
        }
    }

    get unitAngle() {
        let vector = new Vector(1,0);
        return this.calculateAngle(vector);
    }

    scale(scalar) {
        this.dx *= scalar;
        this.dy *= scalar;
    }

    add(vector) {
        this.dx += vector.dx;
        this.dy += vector.dy;
    }
}

class Boid {
    constructor(position, vector, velocity, searchRadius, canvas) {
        this.position = position;
        this.vector = vector;
        this.velocity = velocity;
        this.radius = searchRadius;
        this.canvas = canvas;
        this.angle = this.vector.unitAngle;
    }

    /**
     * Finner et punkt på sirkelen som ligger en avstand |radius| unna this.pos og 
     * vinkelen "vinkel" fra enhetsvektoren i x-rettning.
     * @param {Number} radius radiusen til sirkelen.
     * @param {Number} vinkel vinkelen fra enhetsvektoren i x-rettning.
     */
    addDrawOffset(radius, vinkel) {
        let newX = this.position.x + Math.cos(this.angle + vinkel) * radius;
        let newY = this.position.y + Math.sin(this.angle + vinkel) * radius;
        return [newX, newY];
    }

    /**
     * Tegner en Pilformet-figur på this.pos.
     */
    drawBoidShape(RADIUS, color) {
        this.canvas.fillStyle = color;
        this.canvas.beginPath();
        this.canvas.moveTo(...this.addDrawOffset(RADIUS, 0));
        this.canvas.lineTo(...this.addDrawOffset(0.6 * RADIUS, 5 * Math.PI / 6));
        this.canvas.lineTo(...this.addDrawOffset(0, 0));
        this.canvas.lineTo(...this.addDrawOffset(0.6 * RADIUS, 7 * Math.PI / 6));
        this.canvas.lineTo(...this.addDrawOffset(RADIUS, 0));
        this.canvas.closePath();
        this.canvas.fill();
    }

    /**
     * Tegner en Pilformet-figur med svart kant på this.pos som skal representere en fugl.
     */
    drawBoid() {
        this.drawBoidShape(11, "black");
        this.drawBoidShape(10, "red");
    }

    get closeBoids() {
        let closeBoids = boids.slice(0);
        let position = this.position;
        let radius = this.radius;
        function checkIfInside(boid) {
            let vector = Vector.createVector(position, boid.position);
            let statement = radius >= vector.length;
            return statement;
        }
        closeBoids = closeBoids.filter(checkIfInside);
        return closeBoids;
    }

    get uniformMass() {
        let uniformMass = new Point(0, 0);
        this.closeBoids.forEach((boid) => {
            uniformMass.x += boid.position.x;
            uniformMass.y += boid.position.y;
        });
        uniformMass.x = uniformMass.x / this.closeBoids.length;
        uniformMass.y = uniformMass.y / this.closeBoids.length;
        return uniformMass;
    }

    get avgDir() {
        let averageDirection = new Vector(0,0);
        this.closeBoids.forEach((boid) => {
            averageDirection.add(boid.vector);
        });
        averageDirection.scale(1/this.closeBoids.length);
        return averageDirection;
    }

    get seperateBoids() {
        let vectors = [];
        this.closeBoids.forEach((boid) => {
            let boidVector = Vector.createVector(boid.position, this.position)
            boidVector.scale(0.1 ** (boidVector.length - 40));
            vectors.push(boidVector);
        });
        let seperateVector = new Vector(0, 0);
        vectors.forEach((vector) => {
            seperateVector.add(vector);
        })
        return seperateVector;
    }

    /**
     * Finner summen av vektoren mellom:
     * 1) this.pos og this.uniformMass
     * 2) this.pos og this.seperateBoids
     * 3) Vektoren for gjennomsnittsrettningen (this.avgDir)
     */
    updateVector() {        
        let uniformMassVector = Vector.createVector(this.position, this.uniformMass);
        uniformMassVector.scale(1/(0.1**(uniformMassVector.length)));
        let seperateBoids = this.seperateBoids;
        let avgDir = this.avgDir;
        if (avgDir.length != 0) {
            avgDir.scale((uniformMassVector.length + seperateBoids.length)/(2*(avgDir.length)))
        }
        let vector = new Vector(0,0);

        //skalerer avgDir slik at den har en større betydning.
        avgDir.scale(2);

        vector.add(uniformMassVector);
        vector.add(avgDir);
        vector.add(seperateBoids);
        if (vector.length != 0) {
            this.vector = vector;
        }
    }

    moveBoid() {
        this.vector.angle = this.vector.unitAngle;
        this.position.x = (this.position.x + Math.cos((9*this.angle + this.vector.angle)/10) * this.velocity + WIDTH) % WIDTH;
        this.position.y = (this.position.y + Math.sin((9*this.angle + this.vector.angle)/10) * this.velocity + HEIGHT) % HEIGHT;
        this.angle = (9*this.angle + this.vector.angle)/10;
    }


    update() {
        this.updateVector();
        this.moveBoid();
        this.drawBoid();
    }
}

class BoidSwarm {
    constructor(canvas, amount) {
        this.canvas = canvas;
        this.amount = amount;
    }

    createBoids() {
        for (let i = 0; i < this.amount; i++) {
            let position = new Point(Math.random() * WIDTH, Math.random() * HEIGHT);
            let vector = new Vector(Math.random(), Math.random());
            boids.push(new Boid(position, vector, 0.5, 50, this.canvas));
        }
    }

    update() {
        this.canvas.fillStyle = "white";
        this.canvas.fillRect(0, 0, WIDTH, HEIGHT);
        boids.forEach((boid) => {
            boid.update();
        });
    }
}

function setup() {
    let c = document.getElementById("boidSim");
    let ctx = c.getContext("2d");

    c.width = WIDTH;
    c.height = HEIGHT;

    let swarm = new BoidSwarm(ctx,100);
    swarm.createBoids();
    setInterval(() => swarm.update(), 10);
}