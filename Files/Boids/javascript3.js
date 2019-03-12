//@ts-check

function setup() {

    //Lengden og bredden av canvas-element
    const WIDTH = 1000;
    const HEIGHT = 500;

    //Boids på canvas
    let boids = [];

    //Referanse til canvas-element
    let c = document.getElementById("boidSim");
    let ctx = c.getContext("2d");

    //Endrer bredde og høyde på canvas-element
    c.width = WIDTH;
    c.height = HEIGHT;


    class Point {
        /**
         * Definerer en posisjon på canvas
         * @param {Number} x Posisjon i x-rettning
         * @param {Number} y Posisjon i y-rettning
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Vector {
        /**
         * En Vektor er en rettning og størrelse.
         * @param {Number} dx Endring i x-rettning
         * @param {Number} dy Endring i y-rettning
         */
        constructor(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }

        /**
         * Finner lengden av vektoren
         * @returns {Number} Lengden av Vector
         */
        get length() {
            return Math.sqrt(this.dx ** 2 + this.dy ** 2);
        }

        /**
         * Lager en Vektor mellom to punkter
         * @param {Point} pointA Startpunktet for ny Vektor
         * @param {Point} pointB Sluttpunktet for ny Vektor
         */
        static createVector(pointA, pointB) {
            return new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
        }

        /**
         * Finner vinkelen mellom to vektorer. 
         * (hvis this.dy >= 0 vil den returnere -ang(this,vector))
         * Vi vil ikke alltid ha den minste vinkelen mellom vektorene.
         * @param {Vector} vector 
         * @returns {Number} Vinkelen mellom this og vector
         */
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

        /**
         * Finner vinkelen mellom enhetsvektoren (1,0) og this. (brukes for å finne bevegelses-rettning)
         * @returns {Number} Vinkel mellom this og enhetsvektor (1,0)
         */
        get unitAngle() {
            let vector = new Vector(1,0);
            return this.calculateAngle(vector);
        }

        /**
         * Skalerer this med en scalar. (multipliserer lengden med scalar)
         * Du kan skalere dx og dy hver for seg fordi:
         * scalar * this.length = scalar * sqrt(dx^2+dy^2) = sqrt((scalar * dx)^2 + (scalar * dy)^2)
         * @param {Number} scalar 
         */
        scale(scalar) {
            this.dx *= scalar;
            this.dy *= scalar;
        }

        /**
         * Adderer vektor til this (this + vector)
         * @param {Vector} vector Vektoren du adderer med.
         */
        add(vector) {
            this.dx += vector.dx;
            this.dy += vector.dy;
        }
    }

    class Boid {
        /**
         * Boid er en definisjon på en fugel i simulasjonen.
         * @param {Point} position Posisjonen på canvas
         * @param {Vector} vector Rettningsvektor
         * @param {Number} velocity Hastighet (lengden av vektoren)
         * @param {Number} searchRadius Søkeradius på boids i området som har en innflytelse på this
         */
        constructor(position, vector, velocity, searchRadius) {
            this.position = position;
            this.vector = vector;
            this.velocity = velocity;
            this.radius = searchRadius;
            this.angle = this.vector.unitAngle;
        }

        /**
         * Finner et punkt på sirkelen som ligger en avstand |radius| unna this.pos og 
         * vinkelen "vinkel" fra enhetsvektoren i x-rettning.
         * @param {Number} radius Radiusen til sirkelen.
         * @param {Number} vinkel Vinkelen fra enhetsvektoren i x-rettning.
         * @returns {Array} Returnerer forskyvet x- og y-posisjon
         */
        addDrawOffset(radius, vinkel) {
            let newX = this.position.x + Math.cos(this.angle + vinkel) * radius;
            let newY = this.position.y + Math.sin(this.angle + vinkel) * radius;
            return [newX, newY];
        }

        /**
         * Tegner en Pilformet-figur på this.pos.
         * @param {Number} RADIUS Radiusen fra midten av Boid-figuren (Størrelse)
         * @param {String} color Fargen på Boid-figuren
         */
        drawBoidShape(RADIUS, color) {
            ctx.fillStyle = color;
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
         * Tegner en rød Pilformet-figur med svart kant på this.pos som skal representere en fugl.
         */
        drawBoid() {
            this.drawBoidShape(11, "black");
            this.drawBoidShape(10, "red");
        }

        /**
         * Finner alle Boids innenfor this.radius i arrayet boids
         * @returns {Array} Liste over Boids innenfor this.radius
         */
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

        /**
         * Finner tyngdepunktet på mangekanten som lages av this.closeBoids
         * Algoritme: finner det aritmetiske-gjennomsnittet av alle x- og y-posisjonene til boids.
         */
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
         * Finner Vektoren for å komme seg unna andre boids 
         * (Lengden på vektor øker eksponentiselt med lengden fra boid, nermere fører til lengre vektor)
         */
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

            //Skalerer avgDir slik at den har en større betydning.
            avgDir.scale(2);

            vector.add(uniformMassVector);
            vector.add(avgDir);
            vector.add(seperateBoids);
            if (vector.length != 0) {
                this.vector = vector;
            }
        }

        /**
         * Flytter Boid i rettningen 10% av this.vektor sinn rettning.
         * Hvis det er 100% vil de være veldig "usikker" på hvilke rettning de skal dra.
         */
        moveBoid() {
            this.vector.angle = this.vector.unitAngle;
            this.position.x = (this.position.x + Math.cos((9*this.angle + this.vector.angle)/10) * this.velocity + WIDTH) % WIDTH;
            this.position.y = (this.position.y + Math.sin((9*this.angle + this.vector.angle)/10) * this.velocity + HEIGHT) % HEIGHT;
            this.angle = (9*this.angle + this.vector.angle)/10;
        }

        /**
         * 1) Oppdaterer vektor basert på boids i nærheten
         * 2) Beveger Boid i ny rettning
         * 3) Tegner Boid på canvas
         */
        update() {
            this.updateVector();
            this.moveBoid();
            this.drawBoid();
        }
    }

    class BoidSwarm {
        /**
         * Denne klassen definerer en gruppering av Boids
         * @param {Number} amount Antall Boids
         */
        constructor(amount) {
            this.amount = amount;
        }

        /**
         * Lager en Boid med tilfeldig Vektor og Posisjon på sjermen og legger den til arrayet boids
         */
        createBoids() {
            for (let i = 0; i < this.amount; i++) {
                let position = new Point(Math.random() * WIDTH, Math.random() * HEIGHT);
                let vector = new Vector(Math.random()-0.5, Math.random()-0.5);
                boids.push(new Boid(position, vector, 0.8, 50));
            }
        }

        /**
         * 1) Tegner skjermen hvit
         * 2) Oppdaterer Boids på skjerm
         * 3) Venter på neste frame
         */
        update() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            boids.forEach((boid) => {
                boid.update();
            });
            window.requestAnimationFrame(() => this.update())
        }
    }

    //Setup - 100 Boids
    let swarm = new BoidSwarm(100);
    swarm.createBoids();
    window.requestAnimationFrame(() => swarm.update())
}