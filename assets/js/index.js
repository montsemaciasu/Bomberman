const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

const introModal = document.getElementById("introModal");
const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const backBtn = document.getElementById("backBtn");
const restartGameBtn = document.getElementById("restartGameBtn");
const restartWinGameBtn = document.getElementById("restartWinGameBtn");

startGameBtn.addEventListener("click", () => {
  game.start();
  introModal.style.display = "none";
});

howToPlayBtn.addEventListener("click", () => {
  introModal.style.display = "none";
  document.getElementById("howToPlayModal").style.display = "flex";
});

backBtn.addEventListener("click", () => {
  document.getElementById("howToPlayModal").style.display = "none";
  introModal.style.display = "flex"; // Mostrar nuevamente el modal de inicio
});

restartWinGameBtn.addEventListener("click", () => {
  gameWinModal.style.display = "none";
  game.start();
});

restartGameBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  game.start();
});

document.addEventListener("keydown", (event) => {
  game.onKeyDown(event.keyCode);
});
document.addEventListener("keyup", (event) => {
  game.onKeyUp(event.keyCode);
});
