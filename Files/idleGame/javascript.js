//@ts-check

let loadImg = [];

class Display {
    constructor(parent) {
        this.p = document.getElementById(parent);
    }

    display() {
        this.p.appendChild(this.div);
    }
}

class Canvas extends Display {
    constructor(parent, width, height) {
        super(parent)

        this.width = width;
        this.height = height;
        this.div = this.canvas;
        this.ctx = this.div.getContext("2d");
    }

    get canvas() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.border = "1px solid black";
        return canvas
    }
}

class Floor {
    constructor(canvas, floorNumber, height) {
        this.c = canvas;
        this.ctx = this.c.ctx;
        this.floorNr = floorNumber;
        this.height = height;
    }

    toCartitianMap(y) {
        return this.c.height - y;
    }

    drawBricks(x,y,w,h) {
        let img = new Image();
        img.src = "Bilder/Bricks.png";
        img.onload = () => {
            this.ctx.drawImage(img,0,0,w,h,x,y,w,h);

            this.ctx.strokeStyle = "black";
            this.ctx.strokeRect(x,y,w,h);
        }
    }

    drawFloor() {
        //walls
       this.drawBricks(this.c.width/4, this.toCartitianMap(20 + this.height + (this.height+2)*this.floorNr),this.c.width/2,this.height)

        //side-walls
        this.drawBricks(3*this.c.width/4 + 1,this.toCartitianMap(20 + this.height + (this.height+2)*this.floorNr),10,this.height)
        this.drawBricks(this.c.width/4 - 9,this.toCartitianMap(20 + this.height + (this.height+2)*this.floorNr),10,this.height)

        //Floors
        this.drawBricks(this.c.width/4,this.toCartitianMap(20 + this.height + (this.height+2)*this.floorNr),this.c.width/2,10)


    }
}

class Tower {
    constructor(canvas) {
        this.c = canvas;
        this.ctx = this.c.ctx;
        this.floors = [];
    }

    addLayer() {
        let floorNr = this.floors.length;
        this.floors.push(new Floor(this.c,floorNr, 100));
    }

    drawTower() {
        this.floors.forEach(floor => {
            floor.drawFloor();
        })
    }

    drawSky() {
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(0,0,this.c.width,this.c.height);
    }

    drawScene() {
        this.drawSky();
        this.drawTower();
    }
}

function setup() {
    let c = new Canvas("game", 1000, 700);
    c.display();
    let tower = new Tower(c);
    tower.addLayer();
    tower.addLayer();
    tower.addLayer();
    tower.drawScene();
}