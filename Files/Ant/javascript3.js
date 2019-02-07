//@ts-check

function setup() {

    /**
     * Definerer denne variablene globalt
     */

    let GRIDSIZE;

    /**
     * Lager globale referanser til lerret
     */

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    /**
     * Inputs fra innstillinger
     */
    let inpRegel = document.getElementById("inpregler");
    let inpfps = document.getElementById("inpfps");
    let inpopf = document.getElementById("inpopf");
    let inpwpc = document.getElementById("inpwpc");

    /**
     * Button fra innstillinger
     */
    let btnregler = document.getElementById("btnregler");
    let btnfart = document.getElementById("btnfart");
    let btnwpc = document.getElementById("btnwpc");

    /**
     * Kobler buttons til funksjoner for å starte mauren og endre hastigheten
     */

    btnregler.addEventListener("click",()=>{
        startAnt(1,inpRegel.value,inpfps.value, inpopf.value, inpwpc.value);
    })

    btnfart.addEventListener("click",()=>{
        changeSpeed(inpfps.value, inpopf.value);
    })

    btnwpc.addEventListener("click",()=>{
        startAnt(1,inpRegel.value,inpfps.value, inpopf.value, inpwpc.value);
    })

    /**
     * Definerer disse variablene til å være globale. for å bruke dem utenfor.
     */

    let updater;
    let ants = [];

    /** 
     * lager et Global array kart over alle cellene på sjermen.
     * Det er globalt, fordi hvis vi har flere maur trenger vi ikke å lagre flere kopier av "kartet". (men i dette tilfellet er det ikke viktig)
     */

    let screen;


    /**
     * Denne funksjonen fjerner alt annet som er på sjermen, og plasserer en ny maur midt på sjermen. Mauren får regler fra inputene. (reset)
     * @param {Number} amountAnt Antall maur (standard er 1). Kunne laget en mulighet for å rediere dette, men det var ikke det jeg ville skulle være fokuset.
     * @param {String} rule regelen for mauren. "RL" er standard regelen. Formatet er String, fordi det kommer fra inpRegel.value.
     * @param {String} interval Mellomrom mellom hver frame. Formatet er String, fordi det kommer fra inpfps.value.
     * @param {String} UPF Oppdateringer per frame (Updates per frame). Formatet er  String, fordi det kommer fra inpopf.value.
     * @param {String} gridsize Størrelse på hver rute. Formatet er String, fordi det kommer fra inpwpc.value (wpc = width per cell).
     */
    function startAnt(amountAnt,rule,interval,UPF,gridsize) {
        GRIDSIZE = Number(gridsize);
        ants = [];
        screen = UniqueFillArrayT(normalizeCells(c.width), UniqueFillArray(normalizeCells(c.height),0))

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, c.width, c.height);

        let colorS = ["green","white","blue","purple","red","lightblue","pink","black","aliceblue","orange","yellow","gray"];
        for(let i = 0; i < amountAnt; i++) {
            ants.push(new Ant(rule.split(""), colorS ,0 , Math.round(c.width/2) , Math.round(c.height/2)));
        }
        
        ants.forEach((e)=>{e.drawAnt()});
        clearInterval(updater);
        updater = setInterval(()=>{
            for(let i = 0; i < Number(UPF); i++) {
                ants.forEach((e)=> {e.update()});
            }}, Number(interval))
    }


    /**
     * Øker farten på Langton's Ant uten reset av mauren
     * @param {Number} interval Mellomrom mellom hver frame
     * @param {Number} UPF Oppdateringer per frame/bevegelser per frame (Updates per frame)
     */
    function changeSpeed(interval,UPF) {
        clearInterval(updater);
        updater = setInterval(()=>{
            for(let i = 0; i < Number(UPF); i++) {
                ants.forEach((e)=> {e.update()});
            }}, Number(interval))
    }


    /**
     * 
     * @param {Number} px deler pixlene på GRIDSIZE, slik at vi kan får et kart over de nødvendige pixlene på sjermen
     * @return {Number} returnerer den nye verdien.
     */
    function normalizeCells(px) {
        return Math.round(px/GRIDSIZE);
    }

    /**
     * Adderer change og hvis den er større enn modulo så vil den begynne å telle fra 0 igjen.
     * @param {Number} congrugence Verdien du ønsker å endre
     * @param {Number} modulo Verdien du skal
     * @param {Number} change endringen
     * @return {Number}
     */
    function modChange(congrugence,modulo,change) {
        return (((congrugence + change) + modulo) % modulo);
    }

    /**
     * Gjør akkurat det samme som array.fill(). (Bruker dette, fordi jeg hadde problemer med at .fill())
     * @param {Number} arrayLength Lengden
     * @param {Number} fillValue 
     * @return {Array}
     */
    function UniqueFillArray(arrayLength,fillValue) {
        let array = []
        for (let i = 0; i < arrayLength; i++) {
            array.push(fillValue);
        }
        return array;
    }

    /**
     * Gjør akkurat det samme som UniqueFillArray(), men lager en "shallow copy" med .slice(0).
     * 
     * @param {Number} arrayLength 
     * @param {Array} fillValue 
     * @return {Array}
     */
    function UniqueFillArrayT(arrayLength,fillValue) {
        let array = []
        for (let i = 0; i < arrayLength; i++) {
            array.push(fillValue.slice(0));
        }
        return array;
    }

    class Ant {

        /**
         * Egenskapene til mauren Maur
         * @param {Array} sequence Reglene mauren skal følge. eks ("R","L")
         * @param {Array} colorSet Et set med farger mauren skal knytte til de ulike reglene.
         * @param {Number} direction Rettningen Mauren skal starte i.
         * @param {Number} x Startposisjon i x-rettning
         * @param {Number} y Startposisjon i y-rettning
         */
        constructor(sequence, colorSet,direction,x,y) {
            this.sequence = sequence;
            this.cSet = colorSet;
            this.d = direction;
            this.x = x;
            this.y = y;
        }

        /**
         * Henter fargen på cellen i det globale arrayet screen
         * @return {Number} tall fra 0 til this.sequence.length
         */
        getColor() {
            return screen[normalizeCells(this.x)][normalizeCells(this.y)];
        }

        /**
         * Tegner mauren dersom størrelsen på hver celle er større en 2 (slik at vi kan tegne den i midten av cellen)
         */
        drawAnt() {
            if (GRIDSIZE > 2) {
                ctx.fillStyle = "brown";
                ctx.fillRect(this.x + 1, this.y + 1, GRIDSIZE - 2, GRIDSIZE - 2);
            }
        }

        /**
         * Endrer ruten mauren står på til den neste i rekken (N+1)%(antall farger)
         */
        changeSquare() {
            const COLOR = this.getColor();
            screen[normalizeCells(this.x)][normalizeCells(this.y)] = modChange(COLOR,this.sequence.length,1);
            ctx.fillStyle = this.cSet[COLOR % (this.cSet.length - 1)];
            ctx.fillRect(this.x, this.y, GRIDSIZE, GRIDSIZE);
        }

        /**
         * Endrer rettning basert på fargen og regelen assosiert med fargen.
         */
        getDirection() {
            let color = this.getColor();
            switch(this.sequence[color]) {
                case "L":
                    this.d = modChange(this.d,4,1);
                    break;
                case "R":
                    this.d = modChange(this.d,4,-1);
                    break;
            }
        }

        /**
         * Funksjonen får mauren til å gå i den rettningen den står i.
         */
        moveDirection() {
            switch(this.d) {
                case 0:
                    this.y -= GRIDSIZE;
                    break
                case 1:
                    this.x -= GRIDSIZE;
                    break
                case 2:
                    this.y += GRIDSIZE;
                    break
                case 3:
                    this.x += GRIDSIZE;
                    break
            }
        }

        /**
         * Får mauren til å gå et steg til neste rute.
         * Mauren skaffer først rettningen den skal gå i, deretter endrer den ruten og går videre. 
         * Hvis mulig vil den også tegne mauren:
         */
        update() {
            this.getDirection()
            this.changeSquare();
            this.moveDirection()
            this.drawAnt();
        }
    }
    
     /**
      * Standard innstilling
      */
     startAnt(1,"RL", 3000, 1, 10)
}
