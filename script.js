const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pencil";

let color = "#000000";
let size = 5;
let opacity = 1;

let undoStack = [];
let redoStack = [];

// Resize canvas
function resize(){

    const img = ctx.getImageData(0,0,canvas.width,canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;

    ctx.putImageData(img,0,0);

}

window.addEventListener("resize", resize);
resize();

// Start drawing
function start(e){
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
}

// Draw
function draw(e){

    if(!drawing) return;

    ctx.lineWidth = size;
    ctx.lineCap = "round";

    ctx.globalAlpha = opacity;

    if(tool === "eraser"){
        ctx.strokeStyle = "#ffffff";
    }else{
        ctx.strokeStyle = color;
    }

    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();

}

// Stop
function stop(){
    if(drawing){
        undoStack.push(canvas.toDataURL());
        redoStack = [];
    }
    drawing = false;
}

// Coordinates
function getX(e){
    return e.clientX || e.touches[0].clientX;
}

function getY(e){
    return e.clientY || e.touches[0].clientY - 60;
}

// Events
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);

canvas.addEventListener("touchstart", start);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stop);

// Tools
document.getElementById("pencil").onclick = ()=> tool="pencil";
document.getElementById("eraser").onclick = ()=> tool="eraser";

// Settings
document.getElementById("color").oninput = e=> color=e.target.value;
document.getElementById("size").oninput = e=> size=e.target.value;
document.getElementById("opacity").oninput = e=> opacity=e.target.value;

// Undo
document.getElementById("undo").onclick = ()=>{

    if(undoStack.length > 0){

        redoStack.push(canvas.toDataURL());

        let img = new Image();
        img.src = undoStack.pop();

        img.onload = ()=>{
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);
        }

    }

};

// Redo
document.getElementById("redo").onclick = ()=>{

    if(redoStack.length > 0){

        let img = new Image();
        img.src = redoStack.pop();

        img.onload = ()=>{
            ctx.drawImage(img,0,0);
        }

    }

};

// Clear
document.getElementById("clear").onclick = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
};

// Save
document.getElementById("save").onclick = ()=>{

    let link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();

};