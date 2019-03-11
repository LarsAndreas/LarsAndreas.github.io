//@ts-check

function setup() {
    const WIDTH = 1000;
    const HEIGHT = 500;

    let boids = [];

    let c = document.getElementById("travelingSalesmanCanvas");
    let ctx = c.getContext("2d");

    c.width = WIDTH;
    c.height = HEIGHT;

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        static createRandomArrayOfPoints(length) {
            let array = [];
            for (let i = 0; i < length; i++) {
                array.push(new Point(Math.random() * WIDTH, Math.random() * HEIGHT));
            }
            return array;
        }

        drawPoint() {
            const RADIUS = 3;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
        }

        static drawPoints(arrayPoints) {
            for(let i = 0; i < arrayPoints.length; i++) {
                arrayPoints[i].drawPoint();
            }
        }

        static drawLine(pointA,pointB) {
            ctx.beginPath();
            ctx.moveTo(pointA.x,pointA.y);
            ctx.lineTo(pointB.x,pointB.y);
            ctx.stroke();
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

        static createVector(a, b) {
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            return new Vector(dx, dy);
        }
    }

    class Sequence {
        constructor(SequenceLength) {
            let countingArray = new Array(SequenceLength);
            countingArray = countingArray.fill(undefined).map((e, i) => i);
            this.sequence = countingArray
        }

        randomizeArray() {
            this.sequence = this.sequence.sort((a, b) => Math.random() - 0.5);
        }

        mutate() {
            this.sequence[Math.round(Math.random() * this.sequence.length)];
        }

        cross(sequenceB) {
            let combination = [];
            let sequenceA = this.sequence.slice(0);
            let length = sequenceA.length;
            for (let i = 0; i < length; i++) {
                if ((i % 2 == 0 && sequenceA.length != 0) || (sequenceB.sequence.length == 0)) {
                    let value = sequenceA[0];
                    sequenceA = sequenceA.filter(e => e != value);
                    sequenceB.sequence = sequenceB.sequence.filter(e => e != value);
                    combination.push(value);
                } else {
                    let value = sequenceB.sequence[0];
                    sequenceA = sequenceA.filter(e => e != value);
                    sequenceB.sequence = sequenceB.sequence.filter(e => e != value);
                    combination.push(value);
                }
            }

            if (combination.length == 0) {
                debugger;
            }
            return combination
        }

    }

    class GeneticAlgorithem {
        constructor(points, populationSize, survivalRate) {
            this.points = points;
            this.populationSize = populationSize;
            this.sequenceLength = points.length;
            this.survivalRate = survivalRate;
            this.population = this.generatePopulation()
        }

        generatePopulation() {
            let population = []
            for (let i = 0; i < this.populationSize; i++) {
                let sequence = new Sequence(this.sequenceLength);
                sequence.randomizeArray()
                population.push(sequence);
            }
            return population;
        }

        nextGeneration() {
            let points = this.points;
            function calculateFitness(sequence) {
                let vectorLength = 0;
                for (let i = 0; i < sequence.length; i++) {
                    let pointA = points[sequence[i]];
                    let pointB = points[sequence[i + 1]]
                    let vector = Vector.createVector(pointA, pointB);
                    vectorLength += vector.length;
                }
                return vectorLength;
            }

            // kanskje bytte om a og b
            this.population.sort((a, b) => calculateFitness(a) - calculateFitness(b));
            let survivalThreshold = Math.round(this.population.length * this.survivalRate);

            let newCitizens = []
            for (let i = 0; i < (this.population.length - survivalThreshold); i++) {
                let sequenceA = this.population[Math.round(Math.random() * survivalThreshold)];
                let sequenceB = this.population[Math.round(Math.random() * survivalThreshold)];
                newCitizens.push(sequenceA.cross(sequenceB));
            }
            this.population = this.population.slice(0, survivalThreshold);
            for (let i = 0; i < (survivalThreshold); i++) {
                this.population.push(newCitizens[i]);
            }
        }

        drawAlgoritm() {
            Point.drawPoints(this.points);
            for(let i = 0; i < this.population.length; i++) {
                let sequenceObj = this.population[i];
                for(let j = 0; j + 1 < sequenceObj.sequence.length; j++) {
                    Point.drawLine(points[sequenceObj.sequence[j]],points[sequenceObj.sequence[j+1]]);
                }
            }
        }
    }
    let points = Point.createRandomArrayOfPoints(10)
    let GA = new GeneticAlgorithem(points, 1000, 0.5);
    GA.generatePopulation();
    setInterval(() => {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        GA.drawAlgoritm();
        GA.nextGeneration();
    }, 1000);
}