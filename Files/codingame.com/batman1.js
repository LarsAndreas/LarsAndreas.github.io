//https://www.codingame.com/ide/puzzle/shadows-of-the-knight-episode-1

var inputs = readline().split(' ');
const W = parseInt(inputs[0]); // width of the building.
const H = parseInt(inputs[1]); // height of the building.
const N = parseInt(readline()); // maximum number of turns before game over.
var inputs = readline().split(' ');
const X0 = parseInt(inputs[0]);
const Y0 = parseInt(inputs[1]);

let dx = [0,W-1];
let dy = [0,H-1];

let x = X0;
let y = Y0;

// game loop
while (true) {
    const bombDir = readline(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)

    if(bombDir == "U") {
        dx[0] = x;
        dx[1] = x;
        dy[1] = y-1;
    } else if(bombDir == "UR"){
        dx[0] = x+1;
        dy[1] = y-1;
    } else if(bombDir == "R"){
        dx[0] = x+1;
        dy[0] = y;
        dy[1] = y;
    } else if(bombDir == "DR"){
        dx[0] = x+1;
        dy[0] = y+1;
    } else if(bombDir == "D"){
        dx[0] = x;
        dx[1] = x;
        dy[0] = y+1;
    } else if(bombDir == "DL"){
        dx[1] = x-1;
        dy[0] = y+1;
    } else if(bombDir == "L"){
        dx[1] = x-1;
        dy[1] = y;
        dy[1] = y;
    } else if(bombDir == "UL"){
        dx[1] = x-1;
        dy[1] = y-1;
    };

    x = Math.round((dx[0] + dx[1])/2);
    y = Math.round((dy[0] + dy[1])/2);
    // the location of the next window Batman should jump to.
    console.log(`${x} ${y}`);
}