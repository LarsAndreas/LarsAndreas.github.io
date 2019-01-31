function setup() {
    var rotateBox = [
        { transform: 'rotate(0)', color: 'darkorchid' },
        { color: 'lightcyan' },
        { transform: 'rotate(360deg)', color: 'darkorchid' },
    ];

    var rotateBoxTiming = {
        duration: 10000,
        interactions: Infinity
    }

    document.getElementById("box").animate(
        rotateBox,
        rotateBoxTiming
    )

    function moveBox(Xnew, Ynew) {
        //Definerer posisjoner jeg ønsker at boksen, skal flytte seg til.
        var Xpos = document.getElementById("box").style.left - "px" + Xnew;
        var Ypos = document.getElementById("box").style.top - "px" + Ynew;
        var XYpos = [Xpos, Ypos];
        var XYnew = [Xnew, Ynew];
        //Flytter boksen 1 pixel per 100ms.
        for (x = Xpos, y = Ypos; (XYpos > [0, 0]) ? (XYnew - [x, y]) : (XYnew + [x, y]); (XYpos > [0, 0]) ? (x++ , y++) : (x-- , y--)) {
            //Bruker setTimeout(event, tid in ms) for at boxen skal endre seg live på skjermen.
            setTimeout(document.getElementById("box").style.top = (Ypos + y) + "px", 100);
            document.getElementById("box").style.top = (Xpos + x) + "px";
        }
    }
    moveBox(400, 300);
}