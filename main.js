// main.js – működő és stabil verzió

const board = document.getElementById("game-board");
const menu = document.getElementById("main-menu");
const resultOverlay = document.getElementById("result-overlay");
const glitchAudio = document.getElementById("glitch-audio");

let boardSize, bombCount, cells, gameOver;

function startGame(difficulty) {
  menu.classList.add("hidden");
  board.classList.remove("hidden");
  resultOverlay.classList.add("hidden");

  gameOver = false;
  board.innerHTML = "";

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

  board.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
  cells = [];

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => revealCell(i));
    board.appendChild(cell);
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

function calculateAdjacentNumbers() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].bomb) continue;
    const neighbors = getNeighbors(i);
    cells[i].adjacentBombs = neighbors.filter(n => cells[n].bomb).length;
  }
}

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
    const neighbors = getNeighbors(index);
    neighbors.forEach(revealCell);
  }

  checkWin();
}

function endGame() {
  gameOver = true;
  glitchAudio.play();
  resultOverlay.classList.remove("hidden");
  cells.forEach((cell, i) => {
    if (cell.bomb) {
      cell.element.classList.add("bomb");
    }
  });
}

function checkWin() {
  const unrevealed = cells.filter(c => !c.revealed);
  const allBombs = unrevealed.every(c => c.bomb);
  if (allBombs) {
    resultOverlay.textContent = "🎉 WINNER 🎉";
    resultOverlay.classList.remove("hidden");
    gameOver = true;
  }
}

function activateGlitchKitti() {
  startGame("hard");
  glitchAudio.play();
}
