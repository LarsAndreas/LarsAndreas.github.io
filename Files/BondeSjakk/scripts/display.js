//@ts-check

class Display {
    constructor(parent) {
        this.p = parent;
    }

    show() {
        this.p.appendChild(this.div)
    }
}

class Canvas extends Display {
    constructor(parent, id, width, height) {
        super(parent);
        this.width = width;
        this.height = height;
        this.div = this.makeCanvas(id, width, height);
        this.ctx = this.div.getContext("2d");
        this.show();
    }

    makeCanvas(id, width,height) {
        let div = document.createElement("canvas");
        div.id = id;
        div.width = width;
        div.height = height;
        return div;
    }

    fillWhite() {
        this.ctx.fillStyle = "white";
        this.ctx.rect(0,0,this.width,this.height);
        this.ctx.fill();
    }
}