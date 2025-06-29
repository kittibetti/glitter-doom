// ✅ Glitter Doom: Kitty's Revenge – main.js

console.log("✅ main.js loaded");

const boardEl = document.getElementById("game-board");
const menuEl = document.getElementById("main-menu");
const resultOverlay = document.getElementById("result-overlay");
const resultText = document.getElementById("result-text");
const resultSubtext = document.getElementById("result-subtext");
const restartBtn = document.getElementById("restart-button");

let boardSize = 0;
let bombCount = 0;
let cells = [];
let gameOver = false;

const difficulties = {
  sugarcute: { size: 6, bombs: 2 }, // 💗 ÚJ!
  easy: { size: 8, bombs: 10 },
  medium: { size: 12, bombs: 24 },
  hard: { size: 16, bombs: 40 },
  glitch: { size: 20, bombs: 80 }
};

function startGame(difficulty) {
  const config = difficulties[difficulty] || difficulties.easy;
  boardSize = config.size;
  bombCount = config.bombs;

  const fullBomb = document.getElementById("full-bomb");
  if (fullBomb) {
    fullBomb.classList.add("hidden");
    fullBomb.style.display = "none";
  }

  document.documentElement.style.setProperty('--board-size', boardSize);
  menuEl.classList.add("hidden");
  boardEl.classList.remove("hidden");
  resultOverlay.classList.add("hidden");
  resultOverlay.classList.remove("show");
  resultText.textContent = "";
  resultSubtext.textContent = "";

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
        if (cells[nIndex]?.dataset.bomb === "true") count++;
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

  resultOverlay.classList.remove("hidden");
  resultOverlay.classList.add("show");

  if (won) {
    if (boardSize === 6 && bombCount === 3) {
      // 🎀 SugarCute nyerés
      resultText.textContent = "🎀 YOU'RE ADORABLE 🎀";
      resultText.className = "winner-text";
      resultSubtext.textContent = "You mastered the SugarCute™ world!";
    } else {
      resultText.textContent = "🎉 WINNER 🎉";
      resultText.className = "winner-text";
      resultSubtext.textContent = "You survived the glitter apocalypse!";
    }
  } else {
    if (boardSize === 6 && bombCount === 2) {
      // 💔 SugarCute vesztés
      resultText.textContent = "😿 OOPSIE! 😿";
      resultText.className = "looser-text";
      resultSubtext.textContent = "Even the cutest worlds have traps!";
    } else {
      resultText.textContent = "💀 LOOSER 💀";
      resultText.className = "looser-text";
      resultSubtext.textContent = "Glitter Kitty has claimed your soul";
    }
  }

  // 💣 Mutatjuk az összes bombát VESZTÉS esetén vagy játék végekor
  cells.forEach(cell => {
    if (cell.dataset.bomb === "true") {
      cell.classList.add("bomb");
    }
  });

  const fullBomb = document.getElementById("full-bomb");
  if (fullBomb) {
    fullBomb.classList.remove("hidden");
    fullBomb.style.display = "block";

    setTimeout(() => {
      fullBomb.classList.add("hidden");
      fullBomb.style.display = "none";
    }, 2500);
  }
}


  // 💣 mutatjuk az összes bombát
  cells.forEach(cell => {
    if (cell.dataset.bomb === "true") {
      cell.classList.add("bomb");
   }    
  });

restartBtn.addEventListener("click", () => {
  resultOverlay.classList.add("hidden");
  resultOverlay.classList.remove("show");
  menuEl.classList.remove("hidden");
  boardEl.classList.add("hidden");

  const fullBomb = document.getElementById("full-bomb");
  if (fullBomb) {
    fullBomb.classList.add("hidden");
    fullBomb.style.display = "none";
  }
});

document.getElementById("sugarcute").addEventListener("click", () => startGame("sugarcute"));
document.getElementById("easy").addEventListener("click", () => startGame("easy"));
document.getElementById("medium").addEventListener("click", () => startGame("medium"));
document.getElementById("hard").addEventListener("click", () => startGame("hard"));
document.getElementById("glitchkitti").addEventListener("click", () => startGame("glitch"));
