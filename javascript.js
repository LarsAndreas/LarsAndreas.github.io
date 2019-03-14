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
        div.innerHTML = `<button onClick="window.location = '${this.link}'"><a href="${this.link}">${this.folder}</a></button><span><div class="box"><div class="desc">${this.description}</div></div>`;
        div.className = "link";
        return div;
    }
}

class Links {
    constructor(json,parent) {
        this.json = json;
        this.parent = parent;
    }

    get Links() {
        let links = [];
        this.json.forEach(json=>links.push(new Link(this.parent, json.Folder, json.Description)))
        return links;
    }

    showLinks() {
        this.Links.forEach(link=>link.display());
    }
}

function setup() {
    let main = document.getElementById("main");
    let projects = new Links(dataJson, main);
    projects.showLinks();
}