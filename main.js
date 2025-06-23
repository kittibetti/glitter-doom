
let board = [];
let rows, cols, mines;
let gameOver = false;

function restartGame() {
  const boardElem = document.getElementById("board");
  boardElem.innerHTML = "";
  gameOver = false;
  document.getElementById("looser").classList.add("hidden");
  document.getElementById("scared-text").classList.add("hidden");

  const difficulty = document.getElementById("difficulty").value;
  if (difficulty === 'easy') { rows = cols = 8; mines = 10; }
  else if (difficulty === 'medium') { rows = cols = 12; mines = 20; }
  else if (difficulty === 'hard') { rows = cols = 16; mines = 40; }
  else { rows = cols = 20; mines = 50; }

  boardElem.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ revealed: false, bomb: false, count: 0 })));

  let placed = 0;
  while (placed < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].bomb) {
      board[r][c].bomb = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].bomb) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].bomb) count++;
          }
        }
        board[r][c].count = count;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.addEventListener("click", () => reveal(r, c, div));
      document.getElementById("board").appendChild(div);
      board[r][c].element = div;
    }
  }
}

function reveal(r, c, div) {
  if (gameOver || board[r][c].revealed) return;
  const cell = board[r][c];
  cell.revealed = true;
  div.classList.add("revealed");

  if (cell.bomb) {
    div.classList.add("bomb");
    const img = document.createElement("img");
    img.src = "hello_kitty.png";
    div.appendChild(img);
    revealAllBombs();
    document.getElementById("looser").classList.remove("hidden");
    document.getElementById("scared-text").classList.remove("hidden");
    const audio = document.getElementById("scream");
    audio.currentTime = 0;
    audio.play();
    document.body.style.transition = "background 0.2s";
    document.body.style.backgroundColor = "#fff";
    setTimeout(() => {
      document.body.style.backgroundColor = "";
    }, 150);
    gameOver = true;
    return;
  }

  if (cell.count > 0) {
    div.textContent = cell.count;
    div.style.color = ["", "blue", "green", "red", "purple", "maroon", "teal", "black", "gray"][cell.count];
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          reveal(nr, nc, board[nr][nc].element);
        }
      }
    }
  }
}

function revealAllBombs() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.bomb && !cell.revealed) {
        const el = cell.element;
        el.classList.add("revealed", "bomb");
        const img = document.createElement("img");
        img.src = "hello_kitty.png";
        el.appendChild(img);
      }
    }
  }
}

window.onload = restartGame;
