function setup() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCHsmSMLFtzcG_WWTWNjhNgHVxMK1G6-mM",
        authDomain: "risk-adfd4.firebaseapp.com",
        databaseURL: "https://risk-adfd4.firebaseio.com",
        projectId: "risk-adfd4",
        storageBucket: "risk-adfd4.appspot.com",
        messagingSenderId: "288731037708"
    };
    firebase.initializeApp(config);

    let database = firebase.database();
    let land = database.ref("land");
    land.on("child_added", visLand)

function visLand(snapshot) {
    let land = snapshot.key;
    let divMain = document.getElementById("main");
    let upperCaseLand = land.charAt(0).toUpperCase() + land.slice(1)
    divMain.innerHTML += `<div>${upperCaseLand}</div>`;
}

//---------------Annen--------------

function setCenter(className) {

    let allCenterElements = document.getElementsByClassName(className)

    for (let i = 0; i < allCenterElements.length; i++) {
        let height = allCenterElements[i].offsetHeight;
        let width = allCenterElements[i].offsetWidth;
        allCenterElements[i].style.left = "calc((100% - " + width + "px) / 2)";
        allCenterElements[i].style.top = "calc((100% - " + height + "px + 5px) / 2)";
    }
}
    setCenter("center")

    window.addEventListener('resize', function (event) {
        setCenter("center")
    });

    //---------------------------


    let inpLand = document.getElementById("land");
    let inpRegion = document.getElementById("region");

    let btnLagreLand = document.getElementById("lagreland");
    btnLagreLand.addEventListener("click", lagreLand);

    let inpKort = document.getElementById("kort");
    let inpAntallNye = document.getElementById("antallnye");

    let btnLagreKort = document.getElementById("lagrekort");
    btnLagreKort.addEventListener("click", lagreKort);

    function lagreLand(e) {
        let land = inpLand.value;
        let kortid = inpRegion.value;
        let ref = database.ref("land/" + land);
        ref.set({ kortid });
    }

    function lagreKort(e) {
        let kort = inpKort.value;
        let antallnye = inpAntallNye.value;
        let ref = database.ref("kort/" + kort);
        ref.set({ antallnye });
    }

    let inpBruker = document.getElementById("bruker");
    let inpAlder = document.getElementById("alder");
    let inpFarge = document.getElementById("farge");
    let inpNavn = document.getElementById("navn");

    let btnLagreSpiller = document.getElementById("lagrespiller");
    btnLagreSpiller.addEventListener("click", lagreSpiller);

    function lagreSpiller(e) {
        let brukernavn = inpBruker.value;
        let alder = inpAlder.value;
        let farge = inpFarge.value;
        let navn = inpNavn.value;
        let ref = database.ref("spiller/" + brukernavn);
        ref.set({ alder, farge, navn });
    }
}
