//@ts-check

function setup() {

    /**
     * Lager referanser til knappene i option
     */
    let btnJorda = document.getElementById("btnJorda")
    let btnJupiter = document.getElementById("btnJupiter")

    /**
     * Lager eventlistner på knappene
     */
    btnJorda.addEventListener("click", (e)=>{
        let Jorda = new Planet("Jorda",c.width/2, c.height/2, 10, 100, 0.1,0, "green")
        if (btnJorda.checked) {
            planeter.push(Jorda)
        } else {
            planeter = planeter.filter(elm=> elm.name != "Jorda" );
        }
    })

    btnJupiter.addEventListener("click", (e)=>{
        let Jupiter = new Planet("Jupiter",c.width/2, c.height/2, 10, 150, 0.11,80, "brown");
        if (btnJupiter.checked) {
            planeter.push(Jupiter)
        } else {
            planeter = planeter.filter(elm=> elm.name != "Jupiter" );
        }
    })

    /**
     * Lager en refferanse til lerretet
     */

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    /**
     * Tegner en sirkel på canvaset
     * @param {Number} x Senteret av sirkelen i x-rettning
     * @param {Number} y Senteret av sirkelen i y-rettning
     * @param {Number} r Radiusen av sirkelen
     * @param {String} color Fargen på sirkelen
     */
    function drawCircle(x,y,r,color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    class Planet {
        /**
         * Definerer en planet
         * @param {String} name Navnet på planeten (brukes til å hente den ut av array)
         * @param {Number} x Senteret av planetbanen i x-rettning
         * @param {Number} y Senteret av planetbanen i y-rettning
         * @param {Number} radius Radiusen til planeten
         * @param {Number} baneradius Avstanden fra Sola og planeten
         * @param {Number} acceleration Øker vinkelfarten
         * @param {Number} angle Vinkelfarten til banen.
         * @param {String} color Fargen på planeten
         */
        constructor(name,x,y,radius,baneradius,acceleration,angle,color) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.dx = 0;
            this.dy = 0;
            this.r = radius;
            this.Br = baneradius;
            this.ax = acceleration;
            this.color = color;
            this.ang = angle;
        }

        /**
         * Øker vinkelen mellom startvinkel og nåverende-vinkel
         */

        move() {
            this.ang += this.ax;
        }

        /**
         * Converterer vinklene fra grader til radianer slik at vi kan bruke dem. 
         * Tar sinus og cosinus * bane radiusen slik at den alltid vil være på et punkt |r| unna senteret (this.x,this.y).
         */
        translate() {
            this.dx = Math.sin((Math.PI * this.ang)/90) * this.Br;
            this.dy = Math.cos((Math.PI * this.ang)/90) * this.Br;
        }

        /**
         * Tegner en Sirkel, som skal symboliserer en planet.
         */

        draw() {
            drawCircle(this.x + this.dx,this.y + this.dy,this.r,this.color);
        }

        /**
         * Oppdaterer posisjonen og tegner en planet der.
         */
        update() {
            this.move();
            this.translate();
            this.draw();
        }
    }

    /**
     * Liste med planeter i solsystemet
     */

    let planeter  = [];

    /**
     * 
     * @param {array} array Liste over planeter  
     */
    function updateRelativePosition(array) {
        let distance = c.width/2 - 80;
        let dx = distance/array.length;
        array.map(function(e,i) {
            e.Br = 140 + dx * i
            //Tyngdekraften er proposjonal med 1/r^2
            e.ax = 1/(((e.Br/20))**2)
            return e;
        });
    }

    const dt = 1;
    setInterval(()=>{

        /**
         * Sprer planetene utover
         */

        updateRelativePosition(planeter)

        /**
         * Tegner over den tidligere framen, slik at vi kan tegne nytt.
         */

        ctx.fillStyle = "#08162A";
        ctx.fillRect(0, 0, c.width, c.height);
        
        /**
         * Tegner Sola
         */

        drawCircle(c.width/2, c.height/2, 50,"yellow")

        /**
         * Oppdaterer Planeter
         */

        planeter.forEach(planet=>planet.update())
    },dt);
}
