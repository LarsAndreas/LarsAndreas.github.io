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
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    constructor(dx,dy) {
        this.dx = dx;
        this.dy = dy;
    }

    get length() {
        return Math.sqrt(this.dx**2 + this.dy**2);
    }

    calculateAngle(vec2){
        if (vec2.length == 0 || this.length == 0) {
            return "zeroVector";
        } else {
        return Math.acos((this.dx*vec2.dx+this.dy*vec2.dy)/(this.length*vec2.length));
        }
    }

    add(vector) {
        this.dx += vector.dx;
        this.dy += vector.dy;
        return this;
    }

}

class Boid {
    constructor(position,radius,velocity,direction) {
        this.pos = position;
        this.r = radius;
        this.v = velocity;
        this.dir = direction;
    }

    get surroundingBoids() {
        let closeBoids = Boids.slice(0);
        let x = this.pos.x;
        let y = this.pos.y;
        let radius = this.r;
        function searchCloseBoid(boid){
            let dx = x-boid.pos.x;
            let dy = y-boid.pos.y;
            let vector = new Vector(dx,dy);
            if (radius - vector.length >= 0) {
                return true;
            } else {
                return false;
            }
        }
        let m = closeBoids.filter(searchCloseBoid);
        return m;
    }

    get uniformMass() {
        let closeBoids = this.surroundingBoids;
        let x = 0;
        let y = 0;
        let closeBoidsX = closeBoids.slice(0);
        x = closeBoidsX.map((e)=>e.pos.x).reduce((a,b)=>a+b);
        x /= closeBoids.length;
        let closeBoidsY = closeBoids.slice(0);
        y = closeBoidsY.map((e)=>e.pos.y).reduce((a,b)=>a+b);
        y /= closeBoids.length;
        return new Point(x,y);
    }

    get averageDirection() {
        let boids = this.surroundingBoids;
        let boidsLength = boids.length;
        return boids.map((e)=>e.dir).reduce((a,b)=>a+b)/boidsLength;
    }

    moveBoid() {
        this.pos.x = (this.pos.x + Math.cos(this.dir)*this.v + WIDTH) % WIDTH;
        this.pos.y = (this.pos.y - Math.sin(this.dir)*this.v + HEIGHT) % HEIGHT;
    }

    drawBoid() {
        ctx.fillStyle = '#f00';
        const SIZE = 10;
        ctx.beginPath();
        ctx.moveTo(this.pos.x + Math.cos(this.dir)*SIZE, this.pos.y - Math.sin(this.dir)*SIZE);
        ctx.lineTo(this.pos.x + Math.cos(this.dir+ 5*Math.PI/6)*SIZE*0.6, this.pos.y - Math.sin(this.dir + 5*Math.PI/6)*SIZE*0.6);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + Math.cos(this.dir - 5*Math.PI/6)*SIZE*0.6, this.pos.y - Math.sin(this.dir - 5*Math.PI/6)*SIZE*0.6);
        ctx.lineTo(this.pos.x + Math.cos(this.dir)*SIZE, this.pos.y - Math.sin(this.dir)*SIZE);
        ctx.closePath();
        ctx.fill();
    }

    get vector() {

        /**
         * Finner vectoren for avstanden fra fuglene.
         */
        let BoidVectors = [];
        this.surroundingBoids.forEach((boid) => {
            BoidVectors.push(new Vector(this.pos.x - boid.pos.x, this.pos.y - boid.pos.y));
        });
        let avgBoid = new Vector(0,0);
        BoidVectors.forEach((vector)=>{
            if (vector.dx != 0) {
                vector.dx = vector.dx + 1/(vector.dx**3);
            }
            if (vector.dy != 0) {
                vector.dy = vector.dy + 1/(vector.dy**3);
            }
            avgBoid.add(vector);
        });
        avgBoid.dx = avgBoid.dx/BoidVectors.length;
        avgBoid.dy = avgBoid.dy/BoidVectors.length;

        /**
         * Finner vectoren for tyngdepunktet til mangekanten som skapes av Boidene i nærheten.
         */

        let vecTyngepunkt = new Vector(this.uniformMass.x - this.pos.x,this.uniformMass.y - this.pos.y);

         /**
          * Adderer vektorene.
          */

         return avgBoid.add(vecTyngepunkt);
         //return vecTyngepunkt;
         return avgBoid;
    }

    updateDir() {
        let m = this.vector
        let k = m.calculateAngle(new Vector(1,0));
        if (k != undefined) {
            this.dir = this.dir + 0.1 * ((k + this.averageDirection)/2 - this.dir)
        }
    }


    update() {
        this.updateDir();
        this.moveBoid();
        this.drawBoid();
    }
}

class BoidSwarm {
    constructor(swarmSize) {
        this.size = swarmSize;
        this.boids = BoidSwarm.generateBoids(swarmSize);
    }

    static generateBoids(amount) {
        let boids = [];
        for(let i = 0; i < amount; i++) {
            boids.push(new Boid(new Point(Math.random()*WIDTH, Math.random()*HEIGHT),50,1,4*Math.PI*Math.random()))
        }
        return boids;
    }

    update() {
        Boids = this.boids;
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,WIDTH,HEIGHT)
        this.boids.forEach(boid=>boid.update());
    }
}

let swarm = new BoidSwarm(200);
setInterval(()=>{
swarm.update()},10)
}