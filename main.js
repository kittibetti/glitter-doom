console.log("✅ main.js betöltve");

const boardEl = document.getElementById("game-board");
const menuEl = document.getElementById("main-menu");
const resultOverlay = document.getElementById("result-overlay");
const resultText = document.getElementById("result-text");
//const glitchAudio = document.getElementById("glitch-audio");

const restartBtn = document.getElementById("restart-button");
restartBtn.addEventListener("click", () => {
  resultOverlay.classList.remove("show");
  menuEl.classList.remove("hidden");
  boardEl.classList.add("hidden");
});

document.getElementById("easy")?.addEventListener("click", () => startGame("easy"));
document.getElementById("medium")?.addEventListener("click", () => startGame("medium"));
document.getElementById("hard")?.addEventListener("click", () => startGame("hard"));
document.getElementById("glitchkitti")?.addEventListener("click", () => startGame("hard", true));

let boardSize = 0;
let bombCount = 0;
let cells = [];
let gameOver = false;

function startGame(difficulty, glitch = false) {
  console.log("🎮 Játék indul:", difficulty, glitch ? "(glitch mód)" : "");

  menuEl.classList.add("hidden");
  boardEl.classList.remove("hidden");
  resultOverlay.classList.remove("show");
  resultText.textContent = "";
  glitchAudio.pause();
  glitchAudio.currentTime = 0;

  if (difficulty === "easy") {
    boardSize = 8;
    bombCount = 10;
  } else if (difficulty === "medium") {
    boardSize = 12;
    bombCount = 24;
  } else {
    boardSize = 16;
    bombCount = 40;
  }

  cells = [];
  gameOver = false;
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  const bombPositions = new Set();
  while (bombPositions.size < bombCount) {
    bombPositions.add(Math.floor(Math.random() * boardSize * boardSize));
  }

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (bombPositions.has(i)) {
      cell.dataset.bomb = "true";
    }
    boardEl.appendChild(cell);
    cells.push(cell);

    cell.addEventListener("click", () => revealCell(i));
  }

  if (glitch) {
    document.body.classList.add("glitch");
    glitchAudio.play();
    setTimeout(() => document.body.classList.remove("glitch"), 1500);
  }
}

function revealCell(index) {
  const cell = cells[index];
  if (!cell || gameOver || cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");

  if (cell.dataset.bomb === "true") {
    cell.classList.add("bomb");
    endGame(false);
  } else {
    const count = countAdjacentBombs(index);
    if (count > 0) {
      cell.textContent = count;
      cell.classList.add("number");
    } else {
      revealAdjacentSafeCells(index);
    }
  }
}

function countAdjacentBombs(index) {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        const nIndex = ny * boardSize + nx;
        if (cells[nIndex]?.dataset.bomb === "true") {
          count++;
        }
      }
    }
  }

  return count;
}

function revealAdjacentSafeCells(index) {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        const nIndex = ny * boardSize + nx;
        if (!cells[nIndex].classList.contains("revealed")) {
          revealCell(nIndex);
        }
      }
    }
  }
}

function endGame(won) {
  gameOver = true;

  resultText.textContent = won ? "🎉 WINNER 🎉" : "💥 LOOSER 💥";
  resultOverlay.classList.add("show");

  if (!won && glitchAudio) {
    //glitchAudio.play();
  }

  document.body.classList.add("glitch");
  setTimeout(() => document.body.classList.remove("glitch"), 1000);

  cells.forEach((cell) => {
    if (cell.dataset.bomb === "true") {
      cell.classList.add("bomb");
    }
  });

  boardEl.classList.add("hidden");
  menuEl.classList.remove("hidden");
}
