//@ts-check

function setup() {

    let Boids = [];

    let c = document.getElementById("boidSim");
    let ctx = c.getContext("2d");

    const WIDTH = 1000;
    const HEIGHT = 500;

    c.width = WIDTH;
    c.height = HEIGHT;

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Vector {
        /**
         * En vektor er en størrelse og en rettning.
         * @param {Number} dx Endringen i x-rettning.
         * @param {Number} dy Endringen i y-rettning.
         */
        constructor(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }

        /**
         * Finner vektoren mellom punktA og punktB.
         * @param {Point} pointA Start punktet for en ny Vektor.
         * @param {Point} pointB Slutt punktet for en ny Vektor.
         * @return {Vector} Returnerer en vektor fra A til B  (AB).
         */
        static createVector(pointA, pointB) {
            return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
        }

        add(vec) {
            this.dx += vec.dx;
            this.dy += vec.dy;
        }

        scale(scalar) {
            this.dx = this.dx * scalar;
            this.dy = this.dy * scalar;
        }

        /**
         * Finner lengden av vektoren (Pytagoras)
         */
        get length() {
            return Math.sqrt(this.dx ** 2 + this.dy ** 2);
        }

        /**
         * Finner vinkelen mellom this og vec i radianer (omforming av skalarprodukt).
         * @param {Vector} vector Vektoren du ønsker å finne vinkelen mellom segselv og this.
         */
        calculateAngle(vector) {
            if (this.length == 0) {
                return "zeroVector";
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

        /**
         * Finner vinkelen mellom enhetsvektoren i x-rettning og vektoren (this).
         */
        get newAngle() {
            return this.calculateAngle(new Vector(1, 0));
        }
    }

    class Boid {
        constructor(position, vector, velocity, searchRadius) {
            this.pos = position;
            this.vector = vector;
            this.velocity = velocity;
            this.radius = searchRadius;
            this.prevoiusAngle = 0;
            this.prevoiusVectorAng = 0;
        }

        /**
         * Finner et punkt på sirkelen som ligger en avstand |radius| unna this.pos og 
         * vinkelen "vinkel" fra enhetsvektoren i x-rettning.
         * @param {Number} radius radiusen til sirkelen.
         * @param {Number} vinkel vinkelen fra enhetsvektoren i x-rettning.
         */
        addDrawOffset(radius, vinkel) {
            let newX = this.pos.x + Math.cos((this.vector.newAngle + 999 * this.prevoiusVectorAng)/1000 + vinkel) * radius;
            let newY = this.pos.y + Math.sin((this.vector.newAngle + 999 * this.prevoiusVectorAng)/1000 + vinkel) * radius;
            return [newX, newY];
        }

        /**
         * Tegner en Pilformet-figur på this.pos.
         */
        drawBoidShape(RADIUS,color) {
            ctx.fillStyle = color;;
            ctx.beginPath();
            ctx.moveTo(...this.addDrawOffset(RADIUS, 0));
            ctx.lineTo(...this.addDrawOffset(0.6 * RADIUS, 5 * Math.PI / 6));
            ctx.lineTo(...this.addDrawOffset(0, 0));
            ctx.lineTo(...this.addDrawOffset(0.6 * RADIUS, 7 * Math.PI / 6));
            ctx.lineTo(...this.addDrawOffset(RADIUS, 0));
            ctx.closePath();
            ctx.fill();
        }

        /**
         * Tegner en Pilformet-figur med svart kant på this.pos som skal representere en fugl.
         */
        drawBoid() {
            this.drawBoidShape(11,"black");
            this.drawBoidShape(10,"red");
        }

        drawUniformMass() {
            ctx.fillStyle = "black";
            let uPoint = this.uniformMass;
            ctx.fillRect(uPoint.x - 2, uPoint.y - 2, 4, 4);
        }

        /**
         * Søker gjennom alle Boids i listen Boids, og finner alle boids som ligger this.radius unna this
         */
        get closeBoids() {
            let closeBoids = Boids.slice(0);
            let position = this.pos;
            let radius = this.radius
            function checkIfInside(boid) {
                let vector = Vector.createVector(position, boid.pos)
                let statement = radius >= vector.length;
                return statement;
            }
            closeBoids = closeBoids.filter(checkIfInside);
            return closeBoids;
        }

        /**
         * Finner tyngdepunktet for mangekanten som blir skapt av alle Boids innenfor radiusen til this
         * sine posisjoner. 
         * (Tyngdepunktet er det samme som det aritmetiske-gjennomsnittet av alle x- og y-posisjonene)
         */
        get uniformMass() {
            let uniformMass = new Point(0, 0);
            this.closeBoids.forEach((boid) => {
                uniformMass.x += boid.pos.x;
                uniformMass.y += boid.pos.y;
            });
            uniformMass.x = uniformMass.x / this.closeBoids.length;
            uniformMass.y = uniformMass.y / this.closeBoids.length;
            return uniformMass;
        }

        get seperateBoids() {
            let vectors = [];
            this.closeBoids.forEach((boid) => {
                let boidVector = Vector.createVector(boid.pos,this.pos)
                boidVector.scale(0.1**(boidVector.length-40))
                vectors.push(boidVector);
            });
            let seperateVector = new Vector(0,0);
            vectors.forEach((vector)=>{
                seperateVector.add(vector);
            })
            return seperateVector;
        }

        /**
         * Finner det aritmetiske-gjennomsnitt for rettningene av alle boids i this.closeBoids
         */
        get avgDir() {
            let averageDirection = new Vector(0,0);
            this.closeBoids.forEach((boid) => {
                averageDirection.add(boid.vector);
            });
            averageDirection.scale(1/this.closeBoids.length);
            return averageDirection;
        }

        /**
         * Finner summen av vektoren mellom:
         * 1) this.pos og this.uniformMass
         * 2) this.pos og this.seperateBoids
         * 3) Vektoren for gjennomsnittsrettningen (this.avgDir)
         */
        updateVector() {
            let uniformMassVector = Vector.createVector(this.pos, this.uniformMass);
            uniformMassVector.scale(1/0.1**(uniformMassVector.length));
            let seperateBoids = this.seperateBoids;
            let avgDir = this.avgDir;
            avgDir.scale((uniformMassVector.length + seperateBoids.length)/(2*(avgDir.length)))
            let vector = new Vector(0,0);

            avgDir.scale(2);

            vector.add(uniformMassVector);
            vector.add(avgDir);
            vector.add(seperateBoids);
            this.vector = vector;
        }

        get directionVector() {
            let angle = this.prevoiusVector;
            return new Vector(Math.cos(angle),Math.sin(angle));
        }

        /**
         * Beveger this i rettningen this.vector 
         * og hvis this.vector.length = 0 vil den gå i rettningen den gikk da den ikke hadde this.vector.length = 0
         */
        moveBoid() {
            if (this.vector.newAngle == "zeroVector") {
                this.pos.x = (this.pos.x + Math.cos(this.prevoiusAngle) * this.velocity + WIDTH) % WIDTH;
                this.pos.y = (this.pos.y + Math.sin(this.prevoiusAngle) * this.velocity + HEIGHT) % HEIGHT;
            } {
                this.pos.x = (this.pos.x + Math.cos((this.vector.newAngle + 999 * this.prevoiusVectorAng)/1000) * this.velocity + WIDTH) % WIDTH;
                this.pos.y = (this.pos.y + Math.sin((this.vector.newAngle + 999 * this.prevoiusVectorAng)/1000) * this.velocity + HEIGHT) % HEIGHT;
                this.prevoiusVectorAng = (this.vector.newAngle + 9 * this.prevoiusVectorAng)/10;
            }
        }

        update() {
            this.updateVector();
            this.moveBoid();
            //this.drawUniformMass();
            this.drawBoid();
        }
    }

    class BoidSwarm {
        constructor(amount) {
            this.amount = amount;
        }

        generateBoids() {
            for (let i = 0; i < this.amount; i++) {
                let position = new Point(Math.random() * WIDTH, Math.random() * HEIGHT);
                let vector = new Vector(Math.random() - 0.5, Math.random() - 0.5);
                let awareness = 50;
                Boids.push(new Boid(position, vector, 0.5, awareness));
            }
        }

        update() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            Boids.forEach(boid => boid.update());
        }
    }

    let swarm = new BoidSwarm(100);
    swarm.generateBoids();
    setInterval(() => swarm.update(), 10);
}