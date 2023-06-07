
const gameStatusEl = document.getElementById("game-status");
const scoreEl = document.getElementById("score");

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

function startGame() {
  board = generateEmptyBoard();
  addNewTile();
  addNewTile();
  updateBoard();
}

// A function to generate a clean 4x4 board
function generateEmptyBoard() {
  return Array.from({ length: 4 }, () => Array(4).fill(0)); // We create a new array of size 4x4, where each element of the array will be 0
}


function addNewTile() {
  let emptyTilesCount = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyTilesCount++;
      }
    }
  }

  if (emptyTilesCount > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTilesCount);
    let count = 0;

    outerLoop: for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          if (count === randomIndex) {
            board[row][col] = getRandomTileValue();
            break outerLoop;
          }
          count++;
        }
      }
    }
  }
}


// A function that returns a random index within a given range `max`
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}
// A function that returns a random tile value (2 or 4) with a probability of 90% for 2 and 10% for 4
function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tileValue = board[row][col];
      const tile = document.createElement("div");

      tile.className = "tile";
      tile.textContent = tileValue !== 0 ? tileValue : "";

      tile.style.backgroundColor = getTileColor(tileValue);
      tile.style.color = [2, 4, 8].includes(tileValue) ? "#6b6359" : "#fff";

      gameBoard.appendChild(tile);
    }
  }
}

function getTileColor(value) {
  if (value === 0) return "#c8bdae";

  const colorIndex = Math.log2(value) - 1;
  const colors = ["#e7dfd3", "#E7DBBD", "#EFAC73", "#F48E5F", "#EB7A54", "#F45B38", "#E8C96A", "#ECC95C"];

  // If the color index is within the size of the colors array, we return the corresponding color
  if (colorIndex >= 0 && colorIndex < colors.length) {
    return colors[colorIndex];
  }

  return "#ecc95c";
}


function moveTiles(direction) {
  let tileMoved = false;
  console.log(direction);
  const rowIndices = direction === "up" ? [0, 1, 2, 3] : [3, 2, 1, 0];
  const colIndices = direction === "left" ? [0, 1, 2, 3] : [3, 2, 1, 0];

  for (let row of rowIndices) {
    for (let col of colIndices) {
      const currentValue = board[row][col];

      if (currentValue === 0) continue;

      let newRow = row;
      let newCol = col;
      let currentRow = row;
      let currentCol = col;

          // We perform a cycle of moving the tile in the given direction
      while (true) {
        if (direction === "up") {
          newRow--;
          currentRow = newRow + 1;
        } else if (direction === "down") {
          newRow++;
          currentRow = newRow - 1;
        } else if (direction === "left") {
          newCol--;
          currentCol = newCol + 1;
        } else if (direction === "right") {
          newCol++;
          currentCol = newCol - 1;
        }
            // We check whether the new position goes beyond the boundaries of the board
        if (newRow < 0 || newRow >= 4 || newCol < 0 || newCol >= 4) {
          // We reset the row and column positions to stop the movement
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }

        const newValue = board[newRow][newCol];

        if (newValue === 0) {
          board[newRow][newCol] = currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
        } else if (newValue === currentValue) {
          board[newRow][newCol] += currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
          score += currentValue;
          scoreEl.innerText = score;
          break;
        } else {
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }
      }
    }
  }

  if (tileMoved) {
    addNewTile();
    updateBoard();
    isGameOver();
    isGameWon();
  }
}



function isGameOver() {
  const emptyTilesCount = board.flat().filter(tile => tile === 0).length;
  if (emptyTilesCount === 0 && !isMergePossible()) {
    gameStatusEl.textContent = "Game Over!";
    gameStatusEl.classList.add("game-over");
  }
}

function isGameWon() {
  if (board.flat().includes(2048)) {
    gameStatusEl.textContent = "You Win!";
    gameStatusEl.classList.add("game-won");
  }
}


function isMergePossible() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const currentValue = board[row][col];
      if (currentValue === 0) return true;

      if (
        (row !== 3 && board[row + 1][col] === currentValue) ||
        (col !== 3 && board[row][col + 1] === currentValue)
      ) {
        return true;
      }
    }
  }
  return false;
}

function restartGame() {
  board = generateEmptyBoard();
  score = 0;
  scoreEl.innerText = score;
  gameStatusEl.textContent = "";
  gameStatusEl.classList.remove("game-over", "game-won");
  startGame();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    moveTiles("up");
  } else if (event.key === "ArrowDown") {
    moveTiles("down");
  } else if (event.key === "ArrowLeft") {
    moveTiles("left");
  } else if (event.key === "ArrowRight") {
    moveTiles("right");
  }
});

const newGameBtn = document.getElementById("new-game-btn");
newGameBtn.addEventListener("click", resetGame);

function resetGame() {
  score = 0;
  scoreEl.innerText = score;
  startGame();
}

startGame();

function toggleGameRules() {
  var overlay = document.getElementById("game-rules-overlay");
  overlay.style.display = overlay.style.display === "none" ? "block" : "none";
}

function hideGameRules() {
  var overlay = document.getElementById("game-rules-overlay");
  overlay.style.display = "none";
}
