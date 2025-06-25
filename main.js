console.log("✅ main.js betöltve");

// Elemi DOM elemek
const boardEl = document.getElementById("game-board");
const menuEl = document.getElementById("main-menu");
const resultOverlay = document.getElementById("result-overlay");
const resultText = document.getElementById("result-text");
const glitchAudio = document.getElementById("glitch-audio");

let boardSize, bombCount, cells, gameOver;

// A játék indítása
function startGame(difficulty) {
  console.log("🎯 startGame()", difficulty);
  menuEl.classList.add("hidden");
  resultOverlay.classList.add("hidden");
  resultText.textContent = "";
  boardEl.classList.remove("hidden");
  boardEl.innerHTML = "";
  gameOver = false;

  switch (difficulty) {
    case "easy":
      boardSize = 8;
      bombCount = 10;
      break;
    case "medium":
      boardSize = 12;
      bombCount = 24;
      break;
    case "hard":
      boardSize = 16;
      bombCount = 40;
      break;
    default:
      boardSize = 8;
      bombCount = 10;
  }

  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
  cells = [];

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => revealCell(i));
    boardEl.appendChild(cell);
    cells.push({
      element: cell,
      bomb: false,
      revealed: false,
      adjacentBombs: 0,
    });
  }

  placeBombs();
  calculateAdjacentNumbers();
}

// Bombák elhelyezése
function placeBombs() {
  let bombsPlaced = 0;
  while (bombsPlaced < bombCount) {
    const index = Math.floor(Math.random() * cells.length);
    if (!cells[index].bomb) {
      cells[index].bomb = true;
      bombsPlaced++;
    }
  }
}

// Szomszédos bombák kiszámítása
function calculateAdjacentNumbers() {
  cells.forEach((cell, i) => {
    if (cell.bomb) return;
    const neighbors = getNeighbors(i);
    cell.adjacentBombs = neighbors.filter(j => cells[j].bomb).length;
  });
}

// Szomszédos indexek meghatározása
function getNeighbors(index) {
  const neighbors = [];
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
        neighbors.push(ny * boardSize + nx);
      }
    }
  }
  return neighbors;
}

// Cellák felfedése
function revealCell(index) {
  if (gameOver || cells[index].revealed) return;

  const cell = cells[index];
  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.bomb) {
    cell.element.classList.add("bomb");
    endGame();
    return;
  }

  if (cell.adjacentBombs > 0) {
    cell.element.textContent = cell.adjacentBombs;
  } else {
    getNeighbors(index).forEach(revealCell);
  }

  checkWin();
}

// Játék vége
function endGame() {
  gameOver = true;
  glitchAudio.play();
  resultText.textContent = "💥 LOOSER 💥";
  resultOverlay.classList.remove("hidden");
  cells.forEach(cell => {
    if (cell.bomb) cell.element.classList.add("bomb");
  });
}

// Győzelem ellenőrzése
function checkWin() {
  const unrevealed = cells.filter(c => !c.revealed);
  if (unrevealed.every(c => c.bomb)) {
    gameOver = true;
    resultText.textContent = "🎉 WINNER 🎉";
    resultOverlay.classList.remove("hidden");
  }
}

// Glitch mód
function activateGlitchKitti() {
  console.log("👑 glitchkitti activated");
  startGame("hard");
  glitchAudio.play();
}
