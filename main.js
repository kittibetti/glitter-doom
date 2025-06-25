let board = [];
let rows = 8;
let cols = 8;
let bombs = 10;
let gameOver = false;
let revealedCount = 0;

function startGame(difficulty) {
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-board').classList.remove('hidden');
  document.getElementById('result-overlay').classList.add('hidden');
  gameOver = false;
  revealedCount = 0;

  switch (difficulty) {
    case 'easy': rows = cols = 8; bombs = 10; break;
    case 'medium': rows = cols = 12; bombs = 20; break;
    case 'hard': rows = cols = 16; bombs = 40; break;
  }

  generateBoard();
}

function generateBoard() {
  board = [];
  const boardEl = document.getElementById('game-board');
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = {
        revealed: false,
        bomb: false,
        element: document.createElement('div')
      };
      cell.element.classList.add('cell');
      cell.element.addEventListener('click', () => revealCell(r, c));
      boardEl.appendChild(cell.element);
      row.push(cell);
    }
    board.push(row);
  }
  placeBombs();
}

function placeBombs() {
  let placed = 0;
  while (placed < bombs) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].bomb) {
      board[r][c].bomb = true;
      placed++;
    }
  }
}

function revealCell(r, c) {
  if (gameOver || board[r][c].revealed) return;
  const cell = board[r][c];
  cell.revealed = true;
  revealedCount++;
  cell.element.classList.add('revealed');

  if (cell.bomb) {
    cell.element.classList.add('bomb');
    endGame(false);
  } else {
    const count = countAdjacentBombs(r, c);
    if (count > 0) {
      cell.element.textContent = count;
    } else {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !(dr === 0 && dc === 0)) {
            revealCell(nr, nc);
          }
        }
      }
    }
    checkWin();
  }
}

function countAdjacentBombs(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].bomb) count++;
      }
    }
  }
  return count;
}

function endGame(won) {
  gameOver = true;
  const overlay = document.getElementById('result-overlay');
  overlay.classList.remove('hidden');
  if (won) {
    overlay.textContent = '💅 WINNER 💅';
    overlay.style.color = '#00ffcc';
    overlay.style.textShadow = '0 0 10px #00fff2, 0 0 20px #00fff2, 0 0 30px #00fff2';
    const winAudio = new Audio('sounds/victory.mp3');
    winAudio.play();
  } else {
    overlay.textContent = '💀 LOOSER 💀';
    overlay.style.color = '#ff004c';
    overlay.style.textShadow = '0 0 5px #ff004c, 0 0 10px #ff0000, 0 0 20px #ff0000';
    const loseAudio = new Audio('sounds/horror.mp3');
    loseAudio.play();
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].bomb) {
        board[r][c].element.classList.add('bomb');
      }
    }
  }
}

function checkWin() {
  const totalCells = rows * cols;
  if (revealedCount === totalCells - bombs) {
    endGame(true);
  }
}

function activateGlitchKitti() {
  const glitchAudio = new Audio('sounds/glitch.mp3');
  glitchAudio.play();
  alert('🩸 glitchkitti mód aktiválva! (Hamarosan jön!)');
}
