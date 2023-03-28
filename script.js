const car = document.getElementById("my-car");
const left_border = document.getElementById("road").offsetLeft;
const right_border = document.getElementById("road").offsetLeft + 400;

let score = 0;
let high_score = 0;
let update_score = true;
let score_div = document.getElementById("crt-score-val");
let high_score_div = document.getElementById("high-score-val");
let game_is_over = false;
if (window.sessionStorage.getItem("highScore") != null) {
    high_score = Number(window.sessionStorage.getItem("highScore"));
    high_score_div.innerHTML = high_score;
}    
else {
    high_score = 0;
    high_score_div.innerHTML = 0;
}


let moveBy = 10;
let left_pos = document.getElementById("road").offsetLeft;

window.addEventListener("load", () => {
	car.style.position = "absolute";
    car.style.left = `${left_pos + 16}px`;
})

window.addEventListener("keydown", moveArrows);
function moveArrows(e) {
	if (e.key === "ArrowRight") {
        if (parseInt(car.style.left) + moveBy < right_border -44)
    	    car.style.left = parseInt(car.style.left) + moveBy + "px";
    }
    else if (e.key === "ArrowLeft") {
        if (parseInt(car.style.left) + moveBy > left_border + 30)
    	    car.style.left = parseInt(car.style.left) - moveBy + "px";
    }
}


let pos = 0;
const computer_car = document.getElementById("car1"); computer_car.style.position = "absolute";
let left = document.getElementById("road").offsetLeft;
let right= left + 350; computer_car.style.left = `${Math.floor(Math.random() * (right- left) + left)}px`;

let space = window.innerHeight - computer_car.offsetTop;

let lastRenderTime = 0;
let div_speed = 10;


function move(currentTime) {
    window.requestAnimationFrame(move); 
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / div_speed) {
        return;
    }
    lastRenderTime = currentTime;

    space = window.innerHeight - computer_car.offsetTop;
    if (space > 0) {
        draw();
    }
    else{
        pos = -30;
        computer_car.style.top = `${pos}px`;
        let left_pos = document.getElementById("road").offsetLeft;
        let right_pos = left_pos + 350;
        computer_car.style.left = `${Math.floor(Math.random() * (right_pos - left_pos) + left_pos)}px`;
    }
}

let requestID = window.requestAnimationFrame(move);

function draw() {
    pos += 10;
    computer_car.style.top = `${pos}px`;
    if (check_colision()) {
        gameOver();
    }

}

function check_colision() {
    let aRect = car.getBoundingClientRect();
    let bRect = computer_car.getBoundingClientRect();
    if (aRect.top + aRect.height < bRect.top && update_score) {
        if (Number(score_div.innerHTML) === score) {
            ++score;
            ++div_speed;
            score_div.innerHTML = score;
            if (score > high_score) {
                high_score = score;
                window.sessionStorage.setItem("highScore", high_score);
                high_score_div.innerHTML = window.sessionStorage.getItem("highScore");
            }
            update_score = false;
        }
    }
    else if (aRect.top + aRect.height > bRect.top) {
        update_score = true;
    }

    return !(
        (aRect.top + aRect.height < bRect.top) ||
        (aRect.top > bRect.top + bRect.height) ||
        (aRect.left + aRect.width < bRect.left) ||
        (aRect.left > bRect.left + bRect.width)
    );
}

function gameOver() {
    window.requestAnimationFrame = false;
    window.removeEventListener("keydown", moveArrows);
    const final_div = document.createElement("div");
    final_div.setAttribute("id", "final-div");
    final_div.innerHTML = "Game Over";
    document.body.appendChild(final_div);

    const restartBtn = document.createElement("button");
    restartBtn.setAttribute("id", "restart-btn");
    restartBtn.innerHTML = "Restart Game";
    final_div.appendChild(restartBtn);
    restartBtn.addEventListener("click", () => {
        window.location.reload();
    })
}
