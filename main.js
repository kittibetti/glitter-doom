// main.js – Frissítve: glitter hullás Looser után + 10x10 játékban 20 akna

let rows = 10;
let cols = 10;
let mines = 15;
let board = [];
let revealedCount = 0;
let gameOver = false;

const boardElement = document.getElementById("board");

function setDifficulty(difficulty) {
  if (difficulty === 'easy') {
    rows = cols = 8;
    mines = 10;
  } else if (difficulty === 'medium') {
    rows = cols = 10;
    mines = 20; // ← Frissítve 15 helyett 20
  } else if (difficulty === 'hard') {
    rows = cols = 12;
    mines = 25;
  } else {
    rows = cols = 20;
    mines = 50;
  }
}

function createBoard() {
  board = [];
  revealedCount = 0;
  gameOver = false;
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = {
        mine: false,
        revealed: false,
        adjacent: 0,
        element: null
      };
      board[r][c] = cell;

      const el = document.createElement("div");
      el.classList.add("cell");
      el.addEventListener("click", () => reveal(r, c));
      boardElement.appendChild(el);
      cell.element = el;
    }
  }

  let placedMines = 0;
  while (placedMines < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
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
    const img = document.createElement("img");
    img.src = "hello_kitty.png";
    img.alt = "Kitty";
    img.style.width = "100%";
    img.style.height = "100%";
    cell.element.appendChild(img);

    const scream = new Audio("scream.mp3");
    scream.play();

    gameOver = true;
    revealAll();
    showLooser();
    return;
  }

  revealedCount++;

  if (cell.adjacent > 0) {
    cell.element.textContent = cell.adjacent;
    cell.element.classList.add(`number-${cell.adjacent}`);
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          reveal(nr, nc);
        }
      }
    }
  }

  if (revealedCount === rows * cols - mines) {
    gameOver = true;
    showVictoryMessage();
  }
}

function revealAll() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.revealed) {
        cell.revealed = true;
        cell.element.classList.add("revealed");

        if (cell.mine) {
          const img = document.createElement("img");
          img.src = "hello_kitty.png";
          img.alt = "Kitty";
          img.style.width = "100%";
          img.style.height = "100%";
          cell.element.appendChild(img);
        } else if (cell.adjacent > 0) {
          cell.element.textContent = cell.adjacent;
          cell.element.classList.add(`number-${cell.adjacent}`);
        }
      }
    }
  }
}

function showLooser() {
  const subtitle = document.createElement("div");
  subtitle.classList.add("overlay-message");
  subtitle.innerHTML = `
    <div style="
      position: fixed;
      top: calc(100% - 60px);
      left: 50%;
      transform: translateX(-50%);
      font-size: 1rem;
      color: white;
      background: rgba(0,0,0,0.6);
      padding: 10px 20px;
      border-radius: 12px;
      text-shadow: 1px 1px 2px black;
      z-index: 1000;
    ">
      🐾 You scared the kitty!
    </div>
  `;
  document.body.appendChild(subtitle);

  const looser = document.createElement("div");
  looser.innerText = "LOOSER";
  looser.classList.add("overlay-message");
  looser.style.position = "fixed";
  looser.style.top = "50%";
  looser.style.left = "50%";
  looser.style.transform = "translate(-50%, -50%)";
  looser.style.fontSize = "4rem";
  looser.style.color = "#ff00ff";
  looser.style.fontFamily = "'Press Start 2P', cursive";
  looser.style.textShadow = "2px 2px 5px #000";
  looser.style.zIndex = 1000;
  document.body.appendChild(looser);

  startGlitter(); // ← glitter hullás indítása
}

function startGlitter() {
  for (let i = 0; i < 100; i++) {
    const glitter = document.createElement("div");
    glitter.style.position = "fixed";
    glitter.style.top = "-10px";
    glitter.style.left = Math.random() * 100 + "%";
    glitter.style.width = "6px";
    glitter.style.height = "6px";
    glitter.style.borderRadius = "50%";
    glitter.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    glitter.style.zIndex = 999;
    glitter.style.opacity = 0.8;
    glitter.style.pointerEvents = "none";
    glitter.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(glitter);
  }
}

function showVictoryMessage() {
  const victory = document.createElement("div");
  victory.classList.add("overlay-message");
  victory.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ff66ff;
      font-size: 2.2rem;
      font-family: 'Press Start 2P', cursive;
      text-align: center;
      text-shadow: 2px 2px 5px black;
      z-index: 1000;
      background: rgba(0,0,0,0.7);
      padding: 2rem;
      border-radius: 20px;
      animation: glitterFade 1s ease-in-out;
    ">
      🎉 GRATULÁLOK!<br>
      😈 Túlélted a legcukibb poklot.<br>
      🎀 Kitty örökké hálás lesz.
    </div>
  `;
  document.body.appendChild(victory);

  const congrats = new Audio("congratulations-deep-voice-172193.mp3");
  congrats.play();
}

function restartGame() {
  document.querySelectorAll(".overlay-message").forEach(el => el.remove());
  document.querySelectorAll("div[style*='fall']").forEach(el => el.remove()); // glitter törlése
  const difficulty = document.getElementById("difficulty").value;
  setDifficulty(difficulty);
  createBoard();
}

document.addEventListener("DOMContentLoaded", restartGame);
