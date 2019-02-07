//@ts-check
class Square {
    constructor(ctx, x,y,width, height, prime) {
        this.ctx = ctx;
        this.p = prime;
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }

    placeSquare() {
        if (this.p) {
            this.ctx.fillStyle = 'black';
        } else {
            this.ctx.fillStyle = 'white';
        }
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class SystemSquare {
    constructor(ctx, NumberAmount, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.nA = NumberAmount;
        this.cW = canvasWidth;
        this.cH = canvasHeight;
        this.arrayP = this.calculatePrime();
    }

    calculatePrime() {
        let array = [2];
        loop1:
        for(let i = 3; i <= this.nA; i++) {
            for(let j = 0; j < array.length; j++) {
                if(i % array[j] == 0) {
                    continue loop1;
                }
            }
            array.push(i);
        }
        return array;
    }

    placeSquares() {
        const w = 1
        let n = 1;
        let stepLength = 1;
        this.x = 100;
        this.y = 100;
        // bruker 1000 for å teste
      while (n < this.nA) {
        let v = stepLength;
        while (v--) {
          const block = new Square(this.ctx,this.x*w,this.y*w,w,w,this.arrayP.includes(n++));
          block.placeSquare();
          this.y++;
        }
        this.y--;
        this.x--;
        v = stepLength;
        while (v--) {
            const block = new Square(this.ctx,this.x*w,this.y*w,w,w,this.arrayP.includes(n++));
            block.placeSquare();
            this.x--;
        }
        this.x++;
        this.y--;
        v = stepLength;
        while (v--) {
            const block = new Square(this.ctx,this.x*w,this.y*w,w,w,this.arrayP.includes(n++));
            block.placeSquare();
            this.y--;
        }
        this.y++;
        this.x++;
        v = stepLength;
        while (v--) {
            const block = new Square(this.ctx,this.x*w,this.y*w,w,w,this.arrayP.includes(n++));
            block.placeSquare();
            this.x++;
        }
        stepLength += 2;
      }
    }
}

function setup() {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    let ulamSpiral = new SystemSquare(ctx, 100000, 1000, 600);
    ulamSpiral.placeSquares();
}