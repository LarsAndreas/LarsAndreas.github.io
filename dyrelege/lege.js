function setup() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA9Yc7R3aF28MZxYkD2Rjo52Nvgx-oXOO8",
        authDomain: "civcountries-2421e.firebaseapp.com",
        databaseURL: "https://civcountries-2421e.firebaseio.com",
        projectId: "civcountries-2421e",
        storageBucket: "civcountries-2421e.appspot.com",
        messagingSenderId: "221398364857"
    };
    firebase.initializeApp(config);
    let spanKunde = document.getElementById("kundevelger");
    let divDyr = document.getElementById("dyr");

    let ref = firebase.database().ref("dyrelege/kunde");

    ref.once("value").then(function (snapshot) {
        let kundene = snapshot.val();
        if (kundene) {
            let dropBox = makeDrop(kundene);
            spanKunde.innerHTML = dropBox;

            let drpKunde = document.getElementById("kundenr");
            drpKunde.addEventListener("change", visDyr);
        }
    });

    function visDyr(e) {
        let valgt = +document.getElementById("kundenr").value;
        let ref = firebase.database().ref("dyr").orderByChild("kundenr").equalTo(valgt);
        ref.once("value").then(function (snapshot) {
            let dyrene = snapshot.val();
            if (dyrene) {
                let dyrenr = Object.keys(dyrene);
                let dyreliste = `<ol>` +
                    dyrenr.map(e => `<li>${dyrene[e].navn} ${dyrene[e].art}</li>`).join("")
                    + `</ol>`;
                divDyr.innerHTML = dyrliste;

            }
        });
    }


    function makeDrop(kunder) {
        let box = '<select id="kundenr">';
        let kundenr = Object.keys(kunder);
        let navn = kundenr.map(e =>
            `<option value="${e}">${kunder[e].fornavn}</option>`);
        box += navn.join("") + "</select>";
        return box;
    }

}