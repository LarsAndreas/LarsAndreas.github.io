function setup() {
    var config = {
        apiKey: "AIzaSyA9Yc7R3aF28MZxYkD2Rjo52Nvgx-oXOO8",
        authDomain: "civcountries-2421e.firebaseapp.com",
        databaseURL: "https://civcountries-2421e.firebaseio.com",
        projectId: "civcountries-2421e",
        storageBucket: "civcountries-2421e.appspot.com",
        messagingSenderId: "221398364857"
    };
    firebase.initializeApp(config);
    let divListe = document.getElementById("liste");
    let ref = firebase.database().ref("nations");

    function visLand(snapshot) {
        let land = snapshot.val();
        let info = snapshot.val();
        divListe.innerHTML += `
        <div>${land.capital}</div>
        <div>
        <ul>
        <li>Capital: ${info.capital}</li>
        <li>${info.capital} ${info.leader}</li>
        <li>Perks</li>
             <ul>
                <li>Money: ${info.perk.money}</li>
                <li>Move: ${info.perk.move}</li>
                <li>Science: ${info.perk.science}</li>
                <li>War: ${info.perk.war}</li>
            </ul>
        <li>Title: ${info.title}</li>
        </ul>
        </div>
        `;
    }
    ref.on("child_added", visLand);

}