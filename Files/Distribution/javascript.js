function setup() {

    const Width = 500
    let main = document.getElementById("main");

    let storage = new Array(750).fill(0);

    setInterval(display,1000)
    let iteration = 1;
    function display() {
        iteration += 1;
        let maxv = Math.max(...storage);
        let index = storage.findIndex(e => e === maxv);
        console.log(index / 100);
        main.innerHTML = "";
        for(let i = 0; i < 1000; i++) {
            let x = Math.random() * 5;
            let y = Math.random() * 5;
            let vx = (100*Math.sqrt(x*x + y*y)).toFixed(0)
            if (!storage[vx]) storage[vx] = 0;
            storage[vx] += 1
        }
        let width = Width / storage.length
        for(let i = 0; i < storage.length; i++) {
            let div = document.createElement("div");
            div.style.width = `${width}px`;
            div.style.height = `${(storage[i] * 100)/(iteration)}px`;
            div.style.display = "inline-block";
            div.style.backgroundColor = "red";
            main.appendChild(div);
        }
    }
}