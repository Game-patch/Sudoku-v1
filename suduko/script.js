// Sudoku Game with Hints, Timer, and Level Progression
let gridSize = 9; // Start with 9x9 grid (Classic Sudoku), can be changed for larger grids
let grid,
  solvedGrid,
  hintUsed = 0; // Track number of hints used
let startTime, timerInterval;
let level = 1;
let moves = 0; // Track number of moves
let maxMoves = 25; // Default max moves for level 1
let selectedCell = null;

// Timer functionality
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

// Stop the timer when the game is completed or restarted
function stopTimer() {
  clearInterval(timerInterval);
}

// Generate a solved Sudoku grid using backtracking algorithm
function generateSolvedGrid() {
  const board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  function isSafe(board, row, col, num) {
    for (let i = 0; i < gridSize; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const boxSize = Math.sqrt(gridSize);
    const startRow = Math.floor(row / boxSize) * boxSize;
    const startCol = Math.floor(col / boxSize) * boxSize;
    for (let i = startRow; i < startRow + boxSize; i++) {
      for (let j = startCol; j < startCol + boxSize; j++) {
        if (board[i][j] === num) return false;
      }
    }
    return true;
  }

  /// Fill the board with numbers using backtracking
  function solve(board) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= gridSize; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(board);
  return board;
}

// Generate a puzzle by removing numbers from the solved grid
function generatePuzzle(solvedGrid, emptyCellsCount) {
  const puzzle = JSON.parse(JSON.stringify(solvedGrid));
  let cellsRemoved = 0;
  const gridSize = solvedGrid.length;

  // Create a list of all cell coordinates
  const allCells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      allCells.push([row, col]);
    }
  }

  // Shuffle the list of all cell coordinates for randomness
  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]]; // Swap
  }

  // Remove numbers from the grid until we reach the desired empty cells count
  for (const [row, col] of allCells) {
    if (cellsRemoved >= emptyCellsCount) break;
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsRemoved++;
    }
  }

  return puzzle;
}

// Generate a Sudoku grid with a specified number of empty cells
function generateGrid(emptyCellsCount = 40) {
  grid = generatePuzzle(solvedGrid, emptyCellsCount);
  const sudokuGrid = document.getElementById("sudoku-grid");
  sudokuGrid.innerHTML = "";

  const editableInputs = []; // Store all editable inputs in row-wise order

  for (let row = 0; row < gridSize; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.dataset.row = row;
      input.dataset.col = col;

      if (grid[row][col] !== 0) {
        input.value = grid[row][col];
        input.disabled = true;
      } else {
        editableInputs.push(input);
      }

      input.addEventListener("input", function () {
        const val = input.value;

        if (val && !/^[1-9]$/.test(val)) {
          input.value = "";
          return;
        }

        if (val) {
          moves++;
          if (moves > maxMoves) {
            alert(
              `❌ You've exceeded the maximum allowed moves for this level!`
            );
            input.value = "";
            return;
          }

          document.getElementById(
            "moves-display"
          ).textContent = `Moves: ${moves}`;

          // Defer jump until after input is applied
          setTimeout(() => {
            const currentIndex = editableInputs.indexOf(input);
            for (let i = currentIndex + 1; i < editableInputs.length; i++) {
              if (!editableInputs[i].value) {
                editableInputs[i].focus();
                break;
              }
            }
          }, 0);
        }
      });

      input.addEventListener("focus", function () {
        if (selectedCell) selectedCell.classList.remove("selected-cell");
        selectedCell = input;
        selectedCell.classList.add("selected-cell");
      });

      const subgridSize = Math.sqrt(gridSize);
      if (col % subgridSize === subgridSize - 1)
        td.classList.add("subgrid-border");
      if (row % subgridSize === subgridSize - 1)
        td.classList.add("subgrid-border");

      td.appendChild(input);
      tr.appendChild(td);
    }
    sudokuGrid.appendChild(tr);
  }

  startTimer();
}

// key down
document.addEventListener("keydown", function (e) {
  if (!selectedCell || window.innerWidth < 768) return;

  const cell = selectedCell;
  const allInputs = document.querySelectorAll("#sudoku-grid input");
  const index = Array.from(allInputs).indexOf(cell);
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  // Set transition once on all cells (optional setup)
  allInputs.forEach((input) => {
    input.style.transition = "transform 0.2s ease";
  });

  const smoothFocus = (input) => {
    input.style.transform = "scale(1.06)";
    setTimeout(() => {
      input.style.transform = "scale(1)";
    }, 150);

    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const move = (dr, dc) => {
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
      const idx = r * gridSize + c;
      const next = allInputs[idx];
      if (next && !next.disabled && !next.value) {
        next.focus();
        selectedCell = next;
        smoothFocus(next);
        break;
      }
      r += dr;
      c += dc;
    }
  };

  switch (e.key) {
    case "ArrowUp":
      move(-1, 0);
      break;
    case "ArrowDown":
      move(1, 0);
      break;
    case "ArrowLeft":
      move(0, -1);
      break;
    case "ArrowRight":
      move(0, 1);
      break;
    default:
      // Direct number input
      if (/^[1-9]$/.test(e.key) && !selectedCell.disabled) {
        selectedCell.value = e.key;
        selectedCell.dispatchEvent(new Event("input"));
      }
      return;
  }

  e.preventDefault();
});

// Auto-pick difficulty based on level
function autoPickDifficulty() {
  let emptyCellsCount;
  let baseMoves;

  const totalCells = gridSize * gridSize;
  const maxEmptyAllowed = Math.floor(totalCells * 0.8); // Cap: max 80% of the grid can be empty

  if (level >= 1 && level <= 25) {
    // Smoothly increase difficulty from level 1 to 25
    // Level 1: Easy → Level 25: Medium/Hard

    const minEmpty = 36; // Easier (around 40% empty)
    const maxEmpty = 70; // Harder (around 78% empty)
    const minMoves = 25; // Generous moves
    const maxMoves = 45; // Still fair for higher difficulty

    // Normalize level to a 0–1 range
    const progress = (level - 1) / 24;

    // Linearly scale empty cells and allowed moves
    emptyCellsCount = Math.round(minEmpty + progress * (maxEmpty - minEmpty));
    baseMoves = Math.round(minMoves + progress * (maxMoves - minMoves));
  } else if (level <= 100) {
    // Continue difficulty growth for levels 26–100
    emptyCellsCount = 70 + Math.floor((level - 25) * 1.3);
    baseMoves = 45 + Math.floor((level - 25) * 1.1);
  } else if (level <= 150) {
    // Slightly faster growth: Levels 101–150
    emptyCellsCount = 102 + Math.floor((level - 100) * 1.5);
    baseMoves = 100 + Math.floor((level - 100) * 1.3);
  } else if (level <= 225) {
    // Slower growth after level 150
    emptyCellsCount = 177 + Math.floor((level - 150) * 1.2);
    baseMoves = 165 + Math.floor((level - 150) * 1.1);
  } else {
    // Beyond 225: Keep it capped
    emptyCellsCount = maxEmptyAllowed;
    baseMoves = 250;
  }

  // Final safety cap
  emptyCellsCount = Math.min(emptyCellsCount, maxEmptyAllowed);

  maxMoves = baseMoves;
  generateGrid(emptyCellsCount);
}

// Check the solution and provide feedback
function checkSolution() {
  const inputs = document.querySelectorAll("input");
  let isCorrect = true;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const value = parseInt(inputs[i].value);

    if (value !== solvedGrid[row][col] && solvedGrid[row][col] !== 0) {
      inputs[i].classList.add("incorrect");
      isCorrect = false;
    } else if (value === solvedGrid[row][col]) {
      inputs[i].classList.add("correct");
    } else {
      inputs[i].classList.remove("incorrect");
      inputs[i].classList.remove("correct");
    }

    // Remove the visual check (correct/incorrect) after 2 seconds
    setTimeout(() => {
      inputs[i].classList.remove("incorrect");
      inputs[i].classList.remove("correct");
    }, 2000);
  }

  // Check if the solution is correct
  if (isCorrect) {
    stopTimer();
    alert("🎉 Congratulations! Level " + level + " complete.");
    level++;
    moves = 0; // Reset moves
    document.getElementById("moves-display").textContent = `Moves: ${moves}`; // Reset moves display
    autoPickDifficulty();
    document.getElementById("hint-button").disabled = false;

    // Reset hints every 5 levels
    resetHintsForNextLevel();
  } else {
    alert("❌ There are some mistakes. Try again!");
  }
}

// ✅ Define this function globally (not inside another function)

let hintLimitReachedShown = false;

// provide hint
// Constants
const MAX_HINTS = 5;
const MAX_HINTS_MESSAGE = "⚠️ Maximum 5 hints allowed per level!";
const SUCCESS_HINT_MESSAGE = "✅ Hint applied successfully!";
const NO_EMPTY_CELLS_MESSAGE = "🎉 No empty cells left to hint!";

function provideHint() {
  const hintModalBody = document.getElementById("customHintModalBody");
  const hintText = document.getElementById("hint-text");
  const hintButton = document.getElementById("hint-button");

  if (hintUsed >= MAX_HINTS) {
    if (!hintLimitReachedShown) {
      showHintModal(MAX_HINTS_MESSAGE);
      hintLimitReachedShown = true;
    }
    return;
  }

  const emptyCells = [];
  const inputs = document.querySelectorAll("input");

  for (let i = 0; i < gridSize * gridSize; i++) {
    if (!inputs[i].value && !inputs[i].disabled) {
      emptyCells.push(i);
    }
  }

  if (emptyCells.length > 0) {
    const randomCellIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const row = Math.floor(randomCellIndex / gridSize);
    const col = randomCellIndex % gridSize;

    inputs[randomCellIndex].value = solvedGrid[row][col];
    inputs[randomCellIndex].disabled = true;
    hintUsed++;

    if (hintText) {
      hintText.textContent = `Hint Used: ${hintUsed}`;
    }

    if (hintUsed >= MAX_HINTS && hintButton) {
      hintButton.disabled = true;
    }

    showHintModal(SUCCESS_HINT_MESSAGE);
  } else {
    showHintModal(NO_EMPTY_CELLS_MESSAGE);
  }
}

function showHintModal(message) {
  const hintModalBody = document.getElementById("customHintModalBody");
  if (hintModalBody) {
    hintModalBody.textContent = message;
  }
  showCustomModal();
}

function showCustomModal() {
  const modal = document.getElementById("customHintModal");
  if (!modal) return;
  modal.classList.add("show");

  // Auto hide after 3 seconds
  setTimeout(() => {
    modal.classList.remove("show");
  }, 3000);
}

// Restart the puzzle
function restartPuzzle() {
  level = 1;
  hintUsed = 0;
  moves = 0;
  maxMoves = 25;

  // Update moves display
  const movesDisplay = document.getElementById("moves-display");
  if (movesDisplay) {
    movesDisplay.textContent = `Moves: ${moves}`;
  }

  // Enable the hint button safely
  const hintButton = document.getElementById("hint-button");
  if (hintButton) {
    hintButton.disabled = false;
  }

  generateGrid(50); // Default difficulty for restart
  stopTimer();
  startTimer();
}

// Reset the hint counter every 5 levels
function resetHintsForNextLevel() {
  if (level % 5 === 0) {
    hintUsed = 0;
    document.getElementById("hint-text").textContent = `Hint Used: ${hintUsed}`;
    document.getElementById("hint-button").disabled = false; // Re-enable the hint button
  }
}

// Show the number of moves made

function showRules() {
  const alertBox = document.createElement("div");
  alertBox.innerText = `🧠 Sudoku Rules:
1️⃣ Each row, column, and box must contain 1-${gridSize} with no repeats.
⚡ Use logic to fill empty cells.
👍 No guessing! Only valid moves.
🔄 The puzzle has a unique solution (there's always one correct solution).
💡 You can use hints to help solve the puzzle, but they come with a penalty!
⏱️ Timer keeps track of your progress – beat your previous best!
🚫 No pencil marks – only final numbers allowed in the grid.`;

  // Base styles
  Object.assign(alertBox.style, {
    position: "fixed",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#000",
    color: "#fff",
    padding: "16px",
    border: "2px solid #444",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255,255,255,0.2)",
    zIndex: 1000,
    whiteSpace: "pre-line",
    opacity: "0",
    transition: "opacity 0.5s ease",
    fontSize: "1rem",
    maxWidth: "90vw",
    width: "400px",
    textAlign: "left",
    boxSizing: "border-box",
  });

  // Responsive tweak: reduce font size on small screens
  if (window.innerWidth < 480) {
    alertBox.style.fontSize = "0.9rem";
    alertBox.style.padding = "12px";
  }

  document.body.appendChild(alertBox);

  // Trigger fade-in
  requestAnimationFrame(() => {
    alertBox.style.opacity = "1";
  });

  // Fade-out after 1.5s and remove after 2s
  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => {
      alertBox.remove();
    }, 500);
  }, 1500);
}

// Enforce Color Sudoku rules (no repeats in any row, column, or subgrid)
function enforceColorRules(grid) {
  const subgridSize = Math.sqrt(gridSize); // For a 9x9 grid, this is 3 (3x3 subgrids)

  // Iterate over each subgrid (3x3 blocks) and apply the rule to each block
  for (let rowStart = 0; rowStart < gridSize; rowStart += subgridSize) {
    for (let colStart = 0; colStart < gridSize; colStart += subgridSize) {
      const numbersInBlock = new Set();

      for (let i = 0; i < subgridSize; i++) {
        for (let j = 0; j < subgridSize; j++) {
          const row = rowStart + i;
          const col = colStart + j;
          const num = grid[row][col];

          if (num !== 0) {
            // Check if the number already exists in the subgrid (no repeating numbers)
            if (numbersInBlock.has(num)) {
              grid[row][col] = 0; // Reset the cell if there's a duplicate in the block
            } else {
              numbersInBlock.add(num); // Add the number to the set of numbers in the block
            }
          }
        }
      }
    }
  }
  // Check for repetitions in the entire grid
  // Check for repetitions in rows
  for (let row = 0; row < gridSize; row++) {
    const numbersInRow = new Set();
    for (let col = 0; col < gridSize; col++) {
      const num = grid[row][col];
      if (num !== 0) {
        if (numbersInRow.has(num)) {
          grid[row][col] = 0; // Reset the cell if there's a duplicate in the row
        } else {
          numbersInRow.add(num);
        }
      }
    }
  }

  // Check for repetitions in subgrids
  // Check for repetitions in columns
  for (let col = 0; col < gridSize; col++) {
    const numbersInCol = new Set();
    for (let row = 0; row < gridSize; row++) {
      const num = grid[row][col];
      if (num !== 0) {
        if (numbersInCol.has(num)) {
          grid[row][col] = 0; // Reset the cell if there's a duplicate in the column
        } else {
          numbersInCol.add(num);
        }
      }
    }
  }
}

// Start the game

solvedGrid = generateSolvedGrid();
autoPickDifficulty();

// Show rules at the start
showRules();

// Attach event listeners for buttons
document
  .getElementById("restart-button")
  .addEventListener("click", restartPuzzle);
document
  .getElementById("check-button")
  .addEventListener("click", checkSolution);
document.getElementById("hint-button").addEventListener("click", provideHint);
