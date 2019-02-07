//@ts-check

class Widgets {
    constructor(parent) {
        this.p = parent;
    }

    display() {
        this.p.appendChild(this.div);
    }
}

class Link extends Widgets {
    constructor(parent, folder, description) {
        super(parent)
        this.folder = folder;
        this.description = description;
    }

    get url() {
        return window.location.href;
    }

    get link() {
        return `${this.url}/Files/${this.folder}/index.html`;
    }

    get div() {
        let div = document.createElement("div");
    div.innerHTML = `<button onClick="window.location = '${this.link}'"><a href="${this.link}">${this.folder}</a></button><span>${this.description}</span>`;
        div.className = "link";
        return div;
    }
}

function setup() {
    let main = document.getElementById("main");
    let files = ["Ant","CircleDetection","Distribution","Primtall-spiral","Solsystem","TravelingSalesman","Trekant-Fractal"];
    for(let i = 0; i < files.length; i++) {
        let link = new Link(main,files[i],"*");
        link.display();
    }
}