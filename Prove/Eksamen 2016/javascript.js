//@ts-check

let stPtoggle = 0;
let img = document.createElement("img");

function setup() {
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100vw";
    img.style.height = "auto";
    img.style.display = "none";
    img.src = "Vedlegg 2/St-Petersburg.png";
    img.addEventListener("click",stPeterClick);
    document.querySelector("body").appendChild(img);
}

function RomaClick() {
    let vid = document.getElementById("video");
    vid.play();
}

function stPeterClick() {
    let divImg = document.getElementById("images");
    if(stPtoggle == 0) {
        stPtoggle = 1;
        img.style.display = "block";
        divImg.style.display = "none";
    } else {
        stPtoggle = 0;
        img.style.display = "none";
        divImg.style.display = "block";
    }
}