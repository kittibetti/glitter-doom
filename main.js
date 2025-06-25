console.log("✅ main.js betöltve");

// 🎯 DOM elemek
const boardEl = document.getElementById("game-board");
const menuEl = document.getElementById("main-menu");
const resultOverlay = document.getElementById("result-overlay");
const resultText = document.getElementById("result-text");
const glitchAudio = document.getElementById("glitch-audio");

let boardSize, bombCount, cells, gameOver;

// 🎮 Menü gomb események
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('easy').addEventListener('click', () => startGame('easy'));
  document.getElementById('medium').addEventListener('click', () => startGame('medium'));
  document.getElementById('hard').addEventListener('click', () => startGame('hard'));
  document.getElementById('glitchkitti').addEventListener('click', () => activateGlitchMode());
});

function startGame(difficulty) {
  // 💣 Beállítások
  if (difficulty === "easy") {
    boardSize = 8;
    bombCount = 10;
  } else if (difficulty === "medium") {
    boardSize = 12;
    bombCount = 20;
  } else if (difficulty === "hard") {
    boardSize = 16;
    bombCount = 40;
  }

  gameOver = false;
  cells = [];
  menuEl.style.display = "none";
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  generateBoard();
}

function generateBoard() {
  const totalCells = boardSize * boardSize;
  const bombs = new Set();

  while (bombs.size < bombCount) {
    bombs.add(Math.floor(Math.random() * totalCells));
  }

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (bombs.has(i)) {
      cell.dataset.bomb = "true";
    }

    cell.addEventListener("click", () => revealCell(i));
    boardEl.appendChild(cell);
    cells.push(cell);
  }
}

function revealCell(index) {
  if (gameOver || cells[index].classList.contains("revealed")) return;

  const cell = cells[index];
  cell.classList.add("revealed");

  if (cell.dataset.bomb === "true") {
    cell.style.backgroundImage = "url('kitty-bomb.png')";
    showGameOver();
  } else {
    const adjacent = countAdjacentBombs(index);
    if (adjacent > 0) {
      cell.textContent = adjacent;
    }
  }
}

function countAdjacentBombs(index) {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        const ni = ny * boardSize + nx;
        if (cells[ni].dataset.bomb === "true") {
          count++;
        }
      }
    }
  }

  return count;
}

function showGameOver() {
  gameOver = true;
  resultOverlay.style.display = "flex";
  resultText.innerHTML = "💥 <span style='font-size: 2em;'>LOOSER</span> 💥";
  glitchAudio.play();
  setTimeout(() => {
    resultOverlay.style.display = "none";
    menuEl.style.display = "flex";
  }, 3000);
}

function activateGlitchMode() {
  document.body.classList.add("glitch-mode");
  glitchAudio.play();
  setTimeout(() => startGame("hard"), 1000);
}
window.startGame = function(difficulty) {
  console.log("Játék indítása:", difficulty);
  // Itt folytathatod a játék logikáját
  menuEl.style.display = 'none';
  boardEl.style.display = 'grid';
  // TODO: generáld le a pályát, állítsd be a nehézséget, stb.
};

window.activateGlitchKitti = function() {
  console.log("👾 GlitchKitti mód aktiválva!");
  // TODO: GlitchKitti mód kódja
};

