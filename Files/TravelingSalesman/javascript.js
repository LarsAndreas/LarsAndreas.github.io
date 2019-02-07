//@ts-check

function setup() {

    const CANVAS = document.getElementById("board");
    const WIDTH = CANVAS.clientWidth;
    const HEIGHT = CANVAS.clientHeight;

    const LINE_THICKNESS = 0.01;

    const POPULATION = 1000;
    const POINTS = 20;
    const MUTATION_RATE = 0.1;
    const SURVIVAL_RATE = 0.3;


    let ctx = CANVAS.getContext("2d");

    class Point {

        constructor(x,y,radius,color) {
            this.x = x;
            this.y = y;
            this.r = radius;
            this.color = color;
        }

        drawPoint() {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.fillStyle = `${this.color}`
            ctx.arc(this.x,this.y,this.r-1,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        static generateRandomPoints(amount) {
            let list = [];
            const radius = 5;
            const widthMinusRadius = WIDTH - 2 * (radius);
            const heightMinusRadius = HEIGHT - 2 * (radius);
            for (let i = 0; i < amount; i++) {
                const randomX = widthMinusRadius * Math.random() + (radius);
                const randomY = heightMinusRadius * Math.random() + (radius);
                const point = new Point(randomX,randomY,radius,"blue");
                list.push(point);
            }
            return list;
        }

    }

    class Line {

        constructor(pointA,pointB) {
            this.A = pointA;
            this.B = pointB;
            this.distance = this.calculateDistance();
        }

        calculateDistance() {
            const deltaX = Math.abs(this.A.x - this.B.x);
            const deltaY = Math.abs(this.A.y - this.B.y);
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        drawLine() {
            ctx.beginPath();
            ctx.strokeStyle=`rgba(0,0,0,${LINE_THICKNESS})`
            ctx.moveTo(this.A.x,this.A.y);
            ctx.lineTo(this.B.x,this.B.y);
            ctx.stroke();
        }

    }

    class Sequence {
        constructor(sequence, points) {
            // ex: this.sequence = [0,1,3,2,5,4,9,7,8,0]
            this.sequence = sequence;
            this.points = points;
            this.lines = this.getLines();
            this.distance = this.calculateDistance();
        }

        getLines() {
            let lines = [];
            for(let i = 0; i < this.points.length; i++) {
                const PointA = this.sequence[i];
                const PointB = this.sequence[i+1];
                const line = new Line(this.points[PointA], this.points[PointB]);
                lines.push(line);
            }
            return lines;
        }

        drawLines() {
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].drawLine();
            }
        }

        calculateDistance() {
            let sum = 0;
            for (let i = 0; i < this.lines.length; i++) {
                sum += this.lines[i].calculateDistance();
            }
            return sum;
        }
    }

    class GeneticAlgorithm {
        constructor(population, mutation, points, survivalRate) {
            this.population = population;
            this.mutation = mutation;
            this.points = points;
            this.survivalRate = survivalRate;
            //array of "sequence" objects
            this.agents = this.generateRandomAgents();
        }
        generateRandomAgent() {
            let sequence = [];
            for(let j = 1; j < this.points.length; j++) {
                sequence.push(j);
            }
            sequence = sequence.sort(() => 0.5 - Math.random());
            sequence.push(0);
            sequence.unshift(0);
            return sequence;
        }

        sortAgentsByFitness() {
            this.agents.sort((a,b) => a.distance - b.distance);
        }

        combine(a,b) {
            const copyA = Object.assign({},a);
            const copyB = Object.assign({},b);

            const sliceIndex = Math.floor((copyA.sequence.length-2) * Math.random()) + 1;

            let copyAA = copyA.sequence.slice(1,sliceIndex);
            let copyAB = copyB.sequence.slice(1,sliceIndex);
            let copyBA = copyA.sequence.slice(sliceIndex, copyA.sequence.length - 1)
            let copyBB = copyB.sequence.slice(sliceIndex, copyB.sequence.length - 1)

            let partsA = [copyAA, copyBA];
            let partsB = [copyAB, copyBB];

            if(Math.random() < 0.5) {
                let sequence = partsA[0]
                sequence = sequence.concat(partsB[1].filter(x => !sequence.includes(x)));
                sequence = sequence.concat(partsB[0].filter(x => !sequence.includes(x)));
    
                sequence.splice(0,0,0);
                sequence.splice(sequence.length,0,0);
    
                return new Sequence(sequence,this.points);

            } else {
                let sequence = partsB[0]
                sequence = sequence.concat(partsA[1].filter(x => !sequence.includes(x)));
                sequence = sequence.concat(partsA[0].filter(x => !sequence.includes(x)));
    
                sequence.splice(0,0,0);
                sequence.splice(sequence.length,0,0);
    
                return new Sequence(sequence,this.points);
                
            }
        }

        generateNewGeneration() {
            this.sortAgentsByFitness();
            console.log(this.agents);
            const agentsToReplace = Math.floor(this.agents.length * (1-this.survivalRate));
            const agentsToKeep = Math.floor(this.agents.length * this.survivalRate)
            for (let i = this.agents.length - 1; i > (this.agents.length - agentsToReplace); i--) {
                if(Math.random() <= this.mutation) {
                    let sequence = this.agents[i].sequence.slice(0)
                    let randomNumberA = Math.round(Math.random()*sequence.length)
                    let randomNumberB = Math.round(Math.random()*sequence.length)
                    while(randomNumberA == randomNumberB) {
                        randomNumberA = Math.round(Math.random()*(sequence.length - 2)) + 1
                        randomNumberB = Math.round(Math.random()*(sequence.length - 2)) + 1
                    }
                    console.log(1,this.agents[i].sequence)
                    this.agents[i].sequence[randomNumberA] = sequence[randomNumberB];
                    this.agents[i].sequence[randomNumberB] = sequence[randomNumberA];
                    console.log(2,this.agents[i].sequence)
                    
                } else {
                    let agentA = this.agents[(Math.floor(Math.random()) * agentsToKeep)];
                    let agentB = this.agents[Math.floor(Math.random() * agentsToKeep)];
                    while(agentA.sequence == agentB.sequence) {
                        agentA = this.agents[Math.floor(Math.random() * agentsToKeep)];
                        agentB = this.agents[Math.floor(Math.random() * agentsToKeep)];
                    }
                    this.agents[i] = this.combine(agentA,agentB);
                }
            }
        }
        
        generateRandomAgents() {
            let list = []
            for (let i = 0; i < this.population; i++) {
                let sequence = this.generateRandomAgent();
                const agent = new Sequence(sequence,this.points);
                list.push(agent);
            }
            return list;
        }

        drawAgentsSequence() {
            for (let i = 0; i < this.population; i++) {
                this.agents[i].drawLines();
            }
        }

        drawPoints() {
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].drawPoint();
            }
        }
 
    }

    const points = Point.generateRandomPoints(POINTS);
    const al = new GeneticAlgorithm(POPULATION, MUTATION_RATE, points, SURVIVAL_RATE);
    al.generateRandomAgents();
    function draw() {
        ctx.fillStyle = "white";
        ctx.rect(0,0,WIDTH,HEIGHT);
        ctx.fill();
        al.generateNewGeneration();
        al.drawAgentsSequence();
        al.drawPoints();
        requestAnimationFrame(draw);
    }
    draw();
}