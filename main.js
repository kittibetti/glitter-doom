console.log("✅ main.js betöltve");

// 🔧 DOM elemek
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

// 🎬 Játék indítása
function startGame(difficulty) {
  console.log(`🎮 Játék indul (${difficulty})`);

  menuEl.classList.add('hidden');
  boardEl.classList.remove('hidden');
  resultOverlay.classList.add('hidden');
  resultText.textContent = '';
  glitchAudio.pause();
  glitchAudio.currentTime = 0;

  // Nehézség beállítása
  if (difficulty === 'easy') {
    boardSize = 8;
    bombCount = 10;
  } else if (difficulty === 'medium') {
    boardSize = 12;
    bombCount = 20;
  } else if (difficulty === 'hard') {
    boardSize = 16;
    bombCount = 40;
  }

  cells = [];
  gameOver = false;

  // Tábla alaphelyzetbe
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  // 💣 Bombák véletlenszerű elhelyezése
  const bombPositions = new Set();
  while (bombPositions.size < bombCount) {
    bombPositions.add(Math.floor(Math.random() * boardSize * boardSize));
  }

  // 🧱 Mezők létrehozása
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (bombPositions.has(i)) {
      cell.dataset.bomb = 'true';
    }
    boardEl.appendChild(cell);
    cells.push(cell);

    // Kattintás figyelése
    cell.addEventListener('click', () => revealCell(i));
  }

  console.log(`📐 Tábla: ${boardSize}x${boardSize}, 💣 bombák: ${bombCount}`);
}

// 🧨 Mező felfedése
function revealCell(index) {
  const cell = cells[index];
  if (!cell || gameOver || cell.classList.contains('revealed')) return;

  cell.classList.add('revealed');

  if (cell.dataset.bomb === 'true') {
    cell.classList.add('bomb');
    endGame(false);
  } else {
    const count = countAdjacentBombs(index);
    if (count > 0) {
      cell.textContent = count;
    } else {
      revealAdjacentSafeCells(index);
    }
  }
}

// 🔢 Szomszédos bombák száma
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
        if (cells[nIndex]?.dataset.bomb === 'true') {
          count++;
        }
      }
    }
  }

  return count;
}

// 🌈 Üres mezők automatikus felfedése
function revealAdjacentSafeCells(index) {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        const nIndex = ny * boardSize + nx;
        if (!cells[nIndex].classList.contains('revealed')) {
          revealCell(nIndex);
        }
      }
    }
  }
}

// 💀 Veszteség vagy győzelem kezelése
function endGame(won) {
  gameOver = true;
  glitchAudio.play();
  resultText.textContent = won ? '🎉 Győzelem!' : '💀 LOOSER';
  resultOverlay.classList.remove('hidden');

  // Opció: fedd fel az összes bombát
  cells.forEach((cell) => {
    if (cell.dataset.bomb === 'true') {
      cell.classList.add('bomb');
    }
  });
}

// 🧟 Glitch mód (később felturbózzuk!)
function activateGlitchMode() {
  console.log("👾 Glitch mód aktiválva!");
  startGame('hard'); // egyelőre a hard nehézséget használja
  glitchAudio.play();
}
