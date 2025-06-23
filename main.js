// main.js – Teljes, frissített verzió minden funkcióval

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
    mines = 15;
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
        }
      }
    }
  }
}

function showLooser() {
  const container = document.createElement("div");
  container.classList.add("overlay-message");
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.textAlign = "center";
  container.style.zIndex = "1000";

  const title = document.createElement("div");
  title.innerText = "LOOSER";
  title.style.fontSize = "4rem";
  title.style.color = "#ff00ff";
  title.style.fontFamily = "'Press Start 2P', cursive";
  title.style.textShadow = "2px 2px 5px #000";
  title.style.marginBottom = "20px";

  const subtitle = document.createElement("div");
  subtitle.innerHTML = `
    <div style="font-size: 1rem; color: white; text-shadow: 1px 1px 2px black;">
      You scared the kitty!<br>
      <span style="font-size: 0.8rem; display: block; margin-top: 8px;">
        Digitally remastered in 8-bit terror – csak erős idegzetű cuki lányoknak™
      </span>
    </div>
  `;

  container.appendChild(title);
  container.appendChild(subtitle);
  document.body.appendChild(container);
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
  const difficulty = document.getElementById("difficulty").value;
  setDifficulty(difficulty);
  createBoard();
}

document.addEventListener("DOMContentLoaded", restartGame);
