// main.js – Glitter Doom: Kitty’s Revenge™ Deluxe

let rows = 0;
let cols = 0;
let mineCount = 0;
let board = [];
let gameOver = false;
let glitchMode = false;

const boardElement = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-button");
const messageContainer = document.getElementById("message-container");
const glitchInput = document.getElementById("glitch-input");
const screamSound = new Audio("scream.mp3");
const winSound = new Audio("congratulations.mp3");

const difficultyLevels = {
  easy: { size: 8, mines: 10 },
  medium: { size: 10, mines: 20 },
  hard: { size: 12, mines: 25 },
  extreme: { size: 20, mines: 50 },
};

function setDifficulty(level) {
  const config = difficultyLevels[level] || difficultyLevels.easy;
  rows = cols = config.size;
  mineCount = config.mines;
  boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
}

function createBoard() {
  board = [];
  gameOver = false;
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        revealed: false,
        mine: false,
        adjacent: 0,
        element: null
      };
    }
  }

  let placed = 0;
  while (placed < mineCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].mine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let nr = r + i;
            let nc = c + j;
            if (
              nr >= 0 && nr < rows &&
              nc >= 0 && nc < cols &&
              board[nr][nc].mine
            ) {
              count++;
            }
          }
        }
        board[r][c].adjacent = count;
      }
    }
  }
}

function reveal(r, c) {
  if (gameOver) return;
  const cell = board[r][c];
  if (cell.revealed) return;
  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.innerHTML = '<img src="hello_kitty.png" alt="Hello Kitty">';
    showLooser();
    revealAll();
    return;
  }

  if (cell.adjacent > 0) {
    cell.element.innerText = cell.adjacent;
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let nr = r + i;
        let nc = c + j;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          reveal(nr, nc);
        }
      }
    }
  }

  checkWin();
}

function revealAll() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.revealed) {
        cell.revealed = true;
        cell.element.classList.add("revealed");
        if (cell.mine) {
          cell.element.classList.add("mine");
          cell.element.innerHTML = '<img src="hello_kitty.png" alt="Hello Kitty">';
        } else if (cell.adjacent > 0) {
          cell.element.innerText = cell.adjacent;
        }
      }
    }
  }
}

function checkWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.revealed && !cell.mine) return;
    }
  }
  showVictory();
}

function showLooser() {
  gameOver = true;
  screamSound.play();
  messageContainer.innerHTML = `
    <div class="looser-message">LOOSER</div>
    <div class="subtext">YOU SCARED THE KITTY</div>
  `;
}

function showVictory() {
  gameOver = true;
  winSound.play();
  messageContainer.innerHTML = `
    <div class="winner-message">YOU SURVIVED</div>
    <div class="subtext">Kitty örökké hálás lesz – túlélted a legcukibb poklot</div>
  `;
}

function renderBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let div = document.createElement("div");
      div.classList.add("cell");
      div.addEventListener("click", () => {
        if (!gameOver) reveal(r, c);
      });
      boardElement.appendChild(div);
      board[r][c].element = div;
    }
  }
}

function startGame() {
  setDifficulty(difficultySelect.value);
  messageContainer.innerHTML = "";
  glitchMode = glitchInput.value.trim().toLowerCase() === "glitchkitti";
  if (glitchMode) {
    document.body.classList.add("glitch");
  } else {
    document.body.classList.remove("glitch");
  }
  createBoard();
  renderBoard();
}

startButton.addEventListener("click", startGame);

document.addEventListener("DOMContentLoaded", () => {
  setDifficulty("easy");
});
