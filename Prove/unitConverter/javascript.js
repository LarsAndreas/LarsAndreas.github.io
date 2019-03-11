//@ts-check

function setup() {
    let selEnhet = document.getElementById("enhet");

    let units = new Map();
    units.set("inches", 2.54);
    units.set("feet", 30.48);
    units.set("yards", 91.44);

    units.forEach((value,key) => {
        let option = document.createElement("option");
        option.innerHTML = key;
        option.value = value;
        selEnhet.appendChild(option)
    });
}

function update() {
    let inpCm = document.getElementById("inpCm");

    let selEnhet = document.getElementById("enhet");
    let selEnhetChoice = selEnhet.options[selEnhet.selectedIndex].text;
    let selEnhetValue = selEnhet.options[selEnhet.selectedIndex].value;

    let divOutput = document.getElementById("output");
    divOutput.innerHTML = `${Number(inpCm.value)/Number(selEnhetValue)} ${selEnhetChoice}`
}