// script.js – Frissített változat győzelmi felirattal és hanggal

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

function showLooser() {
  const looser = document.createElement("div");
  looser.innerText = "LOOSER";
  looser.style.position = "fixed";
  looser.style.top = "50%";
  looser.style.left = "50%";
  looser.style.transform = "translate(-50%, -50%)";
  looser.style.fontSize = "4rem";
  looser.style.color = "#f00";
  looser.style.fontFamily = "'Press Start 2P', cursive";
  looser.style.textShadow = "2px 2px 5px black";
  looser.style.zIndex = 1000;
  document.body.appendChild(looser);
}

function showVictoryMessage() {
  const victory = document.createElement("div");
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
  const difficulty = document.getElementById("difficulty").value;
  setDifficulty(difficulty);
  createBoard();
}

restartGame();
