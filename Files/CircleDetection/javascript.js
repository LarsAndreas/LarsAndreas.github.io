
function setup() {
    let c = document.getElementById("board");
    let ctx = c.getContext("2d");
    c.addEventListener("mousemove", animate)

    function animate(e) {

        ctx.clearRect(0, 0, c.width, c.height);

        ctx.beginPath();
        ctx.arc(c.clientWidth/2, c.clientHeight/2, 200, 0, Math.PI * 2, true);
        if ((e.clientX - c.clientWidth/2)**2 + (e.clientY - c.clientHeight/2)**2 < (20+1 + 200+1)**2) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "darkred";
        }
        ctx.fill()
        ctx.strokeStyle = "red";
        ctx.lineWidth=1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 20, 0, Math.PI * 2, true);
        if ((e.clientX - c.clientWidth/2)**2 + (e.clientY - c.clientHeight/2)**2 < (20+1 + 200+1)**2) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "darkred";
        }
        ctx.fill()
        ctx.strokeStyle = "red";
        ctx.lineWidth=1;
        ctx.stroke();
    }
}