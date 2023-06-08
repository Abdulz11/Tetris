const blocks = document.querySelectorAll(".block-container div");
const width = 10;
const scoreBoard = document.getElementById("scoreboard");
const startBtn = document.getElementById("startbtn");
const gameOverText = document.querySelector(".game-over");
let score = 0;
let currentRotation = 0;
let height = 0;
let length0fGrid = 0;
let timerId;
let gameEnded = false;

// TETRIS SHAPES
const tetra1 = [
  [3, width + 3, width * 2 + 3, width * 2 + 4],
  [3, 4, 5, width + 3],
  [3, 4, width + 4, width * 2 + 4],
  [width + 3, width + 4, width + 5, 5],
];
const tetra2 = [
  [3, width + 3, width + 4, width * 2 + 4],
  [width + 2, width + 3, width * 2 + 3, width * 2 + 4],
  [3, width + 3, width + 4, width * 2 + 4],
  [width + 2, width + 3, width * 2 + 3, width * 2 + 4],
];
const tetra3 = [
  [3, 4, width + 3, width + 4],
  [3, 4, width + 3, width + 4],
  [3, 4, width + 3, width + 4],
  [3, 4, width + 3, width + 4],
];
const tetra4 = [
  [3, width + 3, width * 2 + 3, width * 2 + 3],
  [3, 4, 5],
  [3, width + 3, width * 2 + 3, width * 2 + 3],
  [3, 4, 5],
];
const tetra5 = [
  [3, 4, 5, width + 4],
  [width + 3, width + 4, width + 5, 4],
  [3, width + 3, width * 2 + 3, width + 2],
  [3, width + 3, width * 2 + 3, width + 4],
];

const tetraminoes = [tetra1, tetra2, tetra3, tetra4, tetra5];
// RANDOM TETRA ON MINI DISPLAY
let nextRandom = Math.floor(Math.random() * tetraminoes.length);
// RANDOM TETRA ON DISPLAY
let randomTetra = Math.floor(Math.random() * tetraminoes.length);
// RANDOM POSITION TETRA FALLS FROM
let randomPosition = Math.floor(Math.random() * 3);
console.log(randomPosition);
// CURRENT TETRA
let currentPosition = tetraminoes[randomTetra][currentRotation];
currentPosition = currentPosition.map((index) => index + randomPosition);
console.log(currentPosition);

// DRAW

function draw() {
  currentPosition.forEach(
    (index) => (blocks[index].style.backgroundColor = "white")
  );
}
draw();
// UNDRAW
function undraw() {
  currentPosition.forEach(
    (index) => (blocks[index].style.backgroundColor = "darkkhaki")
  );
}
// STOP TETRA BLOCK
function stop() {
  if (
    currentPosition.some((index) =>
      blocks[index + width].classList.contains("ground")
    )
  ) {
    currentPosition = currentPosition.map((index) => index);
    currentPosition.forEach((index) => blocks[index].classList.add("ground"));
    height = 0;
    length0fGrid = 0;
    // LOAD NEXT RANDOM TETRA ON MINI SCREEN AND DISPLAY
    randomTetra = nextRandom;
    nextRandom = Math.floor(Math.random() * tetraminoes.length);
    randomPosition = Math.floor(Math.random() * 5);
    currentPosition = tetraminoes[randomTetra][currentRotation];
    currentPosition = currentPosition.map((index) => index + randomPosition);

    // CHANGE SCORE
    addScore();
    //  DISPLAY NEXT TETRA ON MINI SCREEN
    displayShape();
    //  CHECK IF GAME IS OVER
    gameOver();
    //  DRAW NEW TETRA ON DISPLAY
    // draw();
  }
}
//  CONTROLS KEYS
function control(e) {
  if (e.code === "ArrowLeft") {
    moveLeft();
  } else if (e.code === "ArrowRight") {
    moveRight();
  } else if (e.code === "ArrowDown") {
    moveDown();
  } else if (e.code === "ArrowUp") {
    rotate();
  }
}
document.addEventListener("keyup", control);
// CONTROLS

// MOVEDOWN
function moveDown() {
  if (gameEnded) return;
  height += 10;
  undraw();
  currentPosition = currentPosition.map((index) => index + width);
  draw();
  stop();
}
// MOVE LEFT
function moveLeft() {
  undraw();
  if (
    currentPosition.some((index) =>
      blocks[index - 1].classList.contains("ground")
    ) ||
    currentPosition.some((index) => index % width === 0)
  ) {
    currentPosition = currentPosition.map((index) => index);
  } else {
    currentPosition = currentPosition.map((index) => index - 1);
    length0fGrid -= 1;
  }
  draw();
}
// MOVE RIGHT
function moveRight() {
  undraw();
  if (
    currentPosition.some((index) =>
      blocks[index + 1].classList.contains("ground")
    ) ||
    currentPosition.some((index) => (index + 1) % width === 0)
  ) {
    currentPosition = currentPosition.map((index) => index);
  } else {
    currentPosition = currentPosition.map((index) => index + 1);
    length0fGrid += 1;
  }
  draw();
}
// ROTATE
function rotate() {
  if (gameEnded) return;
  if (
    !currentPosition.some((index) => index % width === 0) &&
    !currentPosition.some((index) => (index + 1) % width === 0)
  ) {
    undraw();
    currentRotation++;
    // WHEN ON LAST ITEM IN ARRAY START AGAIN FROM FIRST
    if (currentRotation === 4) {
      currentRotation = 0;
    }
    currentPosition = tetraminoes[randomTetra][currentRotation];
    // ADD THE POSITION, WIDTH AND HEIGHT THE TETRA HAD BEFORE THE ROTATION
    currentPosition = currentPosition.map((index) => index + randomPosition);
    currentPosition = currentPosition.map(
      (index) => index + height + length0fGrid
    );

    draw();
  }
}

// MINIGRID
let miniDisplay = document.querySelectorAll(".displaygrid div");
let widthOfMiniGrid = 5;
// FIRST ROATION OF ALL TETRA TO BE DISPLAYED ON MINIGRID
let nextUpTetra = [
  [
    2 + widthOfMiniGrid,
    widthOfMiniGrid * 2 + 2,
    widthOfMiniGrid * 3 + 2,
    widthOfMiniGrid * 3 + 3,
  ],
  [
    widthOfMiniGrid + 2,
    widthOfMiniGrid * 2 + 2,
    widthOfMiniGrid * 2 + 3,
    widthOfMiniGrid * 3 + 3,
  ],
  [
    widthOfMiniGrid + 2,
    widthOfMiniGrid + 3,
    widthOfMiniGrid * 2 + 2,
    widthOfMiniGrid * 2 + 3,
  ],
  [widthOfMiniGrid + 2, widthOfMiniGrid * 2 + 2, widthOfMiniGrid * 3 + 2],
  [
    widthOfMiniGrid + 1,
    widthOfMiniGrid + 2,
    widthOfMiniGrid + 3,
    widthOfMiniGrid * 2 + 2,
  ],
];

// DISPLAY TETRA ON MINIGRID
function displayShape() {
  miniDisplay.forEach((index) => {
    index.style.backgroundColor = "#ffb3d9";
  });
  nextUpTetra[nextRandom].forEach(
    (index) => (miniDisplay[index].style.backgroundColor = "grey")
  );
}
// START/PAUSE GAME
startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    startBtn.innerHTML = "Play";
    timerId = null;
  } else {
    timerId = setInterval(moveDown, 1000);
    scoreBoard.innerHTML = `Score:${score}`;
    startBtn.innerHTML = "Pause";
    displayShape();
  }
});

// ADD SCORE
function addScore() {
  // LOOP THROUGH EACH ROW
  for (let i = 0; i < 199; i += 10) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];
    if (row.every((index) => blocks[index].classList.contains("ground"))) {
      score += 10;
      scoreBoard.innerHTML = `Score: ${score}`;
      row.forEach((index) => {
        blocks[index].style.backgroundColor = "darkkhaki";
      });
      row.forEach((index) => {
        blocks[index].classList.remove("ground");
      });
    }
  }
}
// GAME OVER
function gameOver() {
  let sameDigit = [];
  for (i = 10; i < 20; i++) {
    if (blocks[i].classList.contains("ground")) {
      sameDigit.push(i);
      console.log(sameDigit);
    }
  }
  sameDigit.forEach((index) => {
    currentPosition.forEach((firstIndex) => {
      if (index == firstIndex) {
        clearInterval(timerId);
        gameOverText.style.display = "block";
        gameEnded = true;
        return;
      }
    });
  });
  draw();
}

function playAgain() {
  window.location.reload();
}
