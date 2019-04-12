//@ts-check

/*
Pandigital multiples
https://projecteuler.net/problem=38
*/

function setup() {
    console.log("start")
    document.querySelector("body").innerHTML = "<h1>Pandigital multiples:</h1>"
    for(let i = 0; i < 100000; i++) {
        let pandigitalMultiple = [];
        let incriment = 1;
        let correct = true;
        while(pandigitalMultiple.length < 9) {
            let numberTest = i;
            let number  = numberTest*incriment;
            let arrayNumber = String(number).split("").map(num=>Number(num));
            let check = false;
            arrayNumber.forEach(num => {
                if(pandigitalMultiple.includes(num)) {
                    check = true;
                }
                pandigitalMultiple.push(num);
                if(pandigitalMultiple.includes(0)) {
                    check = true;
                }
            });
            if(check) {
                correct = false;
                break;
            }
            incriment++
        }
        if(correct && incriment > 1) {
            document.querySelector("body").innerHTML += `<h4>Number: ${i}, Pandigital multiple: ${pandigitalMultiple.join("")}</h4>`;
        }
    }
    console.log("end")
}