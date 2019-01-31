function setup() {

    let divSky = document.getElementById("sky");
    let divSanta = document.getElementsByClassName("Julenisse");
    for (i = 0; i < 100; i++) {
    let starMake = document.createElement('div')
    starMake.className = "star"
        divSky.appendChild(starMake)
    }

    let stars = divSky.querySelectorAll(".star")

    stars.forEach(stjerne => {
        let sizeStar = Math.floor(Math.random() * 20);
        stjerne.style.width = (sizeStar + 3) + "px";
        stjerne.style.height = (sizeStar + 3) + "px";
        stjerne.style.left = -120 + Math.floor(Math.random() * 240) + "px";
        stjerne.style.top = - 80 + Math.floor(Math.random() * 160) + "px";
        stjerne.style.backgroundImage = (Math.random() > 0.5) ? "url(star1.png)" : "url(star2.png)";
        stjerne.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        stjerne.style.animationDelay = Math.random() * 100 + "s"
        stjerne.style.animation = "glow " + Math.random() * 100 + "s ease-in-out infinite";
    });

    /// lage pakke for når du trykker på nissen, skal den droppe en pakke
    divSanta.addEventListener("click", dropGifts);
    
        function dropGifts(e) {
            let pakke = document.createElement('div');
            pakke.className = "pakke";
            pakke.style.left = e.screenX + "px";
            pakke.style.top = (e.screenY - 50) + "px";
            divSky.appendChild(pakke);
        }

    /// lager snø på skjermen
    function makeSnow() {
        for (let i = 0; i < 254; i++) {
            let snow = document.createElement('div');
            snow.className = "snow";
            snow.style.left = Math.random() * 100 + "vw";
            snow.style.animationDelay = Math.random() * 5000 + "ms";
            let radius = Math.random() * 10 + 1;
            snow.style.width = radius + "px";
            snow.style.height = radius + "px";
            divSky.appendChild(snow);
        }
    }


    function makeKanonSnow() {
        for (let i = 0; i < 254; i++) {
            let snow = document.createElement('div');
            snow.className = "snow";
            snow.style.left = Math.random() * 100 + "vw";
            snow.style.animationDelay = Math.random() * 5000 + "ms";
            let radius = Math.random() * 10 + 1;
            snow.style.width = radius + "px";
            snow.style.height = radius + "px";
            divSky.appendChild(snow);
        }
    }

    
    makeSnow();
}
