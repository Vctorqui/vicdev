const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtenemos el mayor puntaje del localStorage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Tu Record: ${highScore}`;

const updateFoodPosition = () => {
  // Pasamos un valor aleatorio de 1 a 30 como posicion de comida
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // Mostramos un mensaje de alerta y reiniciamos el juego en caso de perder
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  resetGame();
};

const changeDirection = (e) => {
  // Cambiamos el valor de la velocidad basado en la tecla presionada
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

const resetGame = () => {
  // Reseteamos todas las variables y reiniciamos el juego
  gameOver = false;
  foodX = foodY = snakeX = snakeY = 5;
  velocityX = velocityY = 0;
  snakeBody = [];
  score = 0;
  updateFoodPosition();
  scoreElement.innerText = `Score: ${score}`;
  setIntervalId = setInterval(initGame, 100);
};

// Llamamos a changeDirection en cada clic de tecla y pasamos el
// valor del dataset de la tecla como un objeto
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key }),
  ),
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Chequeamos si la serpiente toma la comida
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    // Agregamos la posicion de la comida al cuerpo de la serpiente
    snakeBody.push([foodY, foodX]);
    // Incrementamos el puntaje y actualizamos el puntaje mas alto
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  // Actualizamos la posicion de la cabeza de la serpiente basado en la velocidad actual
  snakeX += velocityX;
  snakeY += velocityY;

  // Desplazando hacia adelante los valores de los
  // elementos en el cuerpo de la serpiente por uno
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  // Actualizamos la posicion de la cabeza de la serpiente en el cuerpo de la serpiente
  snakeBody[0] = [snakeX, snakeY];

  // Chequeamos si la cabeza de la serpiente esta fuera de la pared, si es asi seteamos gameOver a true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  // Agregamos un div para cada parte del cuerpo de la serpiente
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    // Chequeamos si la cabeza de la serpiente toca el cuerpo, si es asi seteamos gameOver a true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
