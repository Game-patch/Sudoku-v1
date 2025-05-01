let gridSize = 9; // Start with 9x9 grid (Classic Sudoku), can be changed for larger grids
let grid, solvedGrid, hintUsed = 0, undoStack = [];
let startTime, timerInterval;
let level = 1;
let moves = 0; // Track number of moves
let maxMoves = 25; // Default max moves for level 1

// Timer functionality
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timer').textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
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

    while (cellsRemoved < emptyCellsCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
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
    const sudokuGrid = document.getElementById('sudoku-grid');
    sudokuGrid.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < gridSize; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');

            if (grid[row][col] !== 0) {
                input.value = grid[row][col];
                input.disabled = true;
            }

            input.maxLength = 1;
            input.addEventListener('input', function () {
                if (input.value && !/^[1-9]$/.test(input.value)) {
                    input.value = '';
                }
                if (input.value) {
                    moves++; // Increment move on input
                    if (moves > maxMoves) {
                        alert(`❌ You've exceeded the maximum allowed moves for this level!`);
                        input.value = ''; // Reset the input if over the limit
                    } else {
                        document.getElementById('moves-display').textContent = `Moves: ${moves}`; // Update the display
                    }
                }
            });

            const subgridSize = Math.sqrt(gridSize);
            if (col % subgridSize === subgridSize - 1) td.classList.add('subgrid-border');
            if (row % subgridSize === subgridSize - 1) td.classList.add('subgrid-border');

            td.appendChild(input);
            tr.appendChild(td);
        }
        sudokuGrid.appendChild(tr);
    }
    startTimer();
}

// Auto-pick difficulty based on level
function autoPickDifficulty() {
    let emptyCellsCount;
    let maxMoves;

    // Dynamic scaling based on level
    if (level <= 3) {
        emptyCellsCount = 40;
        maxMoves = 25; // Level 1-3: 25 moves max
    } else if (level <= 6) {
        emptyCellsCount = 50;
        maxMoves = 35; // Level 4-6: 35 moves max
    } else if (level <= 9) {
        emptyCellsCount = 55;
        maxMoves = 45; // Level 7-9: 45 moves max
    } else if (level <= 12) {
        emptyCellsCount = 60;
        maxMoves = 50; // Level 10-12: 50 moves max
    } else if (level <= 15) {
        emptyCellsCount = 65;
        maxMoves = 55; // Level 13-15: 55 moves max
    } else if (level <= 18) {
        emptyCellsCount = 70;
        maxMoves = 60; // Level 16-18: 60 moves max
    } else if (level <= 21) {
        emptyCellsCount = 75;
        maxMoves = 65; // Level 19-21: 65 moves max
    } else if (level <= 24) {
        emptyCellsCount = 80;
        maxMoves = 70; // Level 22-24: 70 moves max
    } else if (level <= 27) {
        emptyCellsCount = 85;
        maxMoves = 75; // Level 25-27: 75 moves max
    } else if (level <= 30) {
        emptyCellsCount = 90;
        maxMoves = 80; // Level 28-30: 80 moves max
    } else if (level <= 40) {
        emptyCellsCount = 100;
        maxMoves = 90; // Level 31-40: 90 moves max
    } else if (level <= 50) {
        emptyCellsCount = 110;
        maxMoves = 100; // Level 41-50: 100 moves max
    } else if (level <= 60) {
        emptyCellsCount = 120;
        maxMoves = 110; // Level 51-60: 110 moves max
    } else if (level <= 70) {
        emptyCellsCount = 130;
        maxMoves = 120; // Level 61-70: 120 moves max
    } else if (level <= 80) {
        emptyCellsCount = 140;
        maxMoves = 130; // Level 71-80: 130 moves max
    } else if (level <= 90) {
        emptyCellsCount = 150;
        maxMoves = 140; // Level 81-90: 140 moves max
    } else if (level <= 100) {
        emptyCellsCount = 160;
        maxMoves = 150; // Level 91-100: 150 moves max
    } else if (level <= 120) {
        emptyCellsCount = 180;
        maxMoves = 160; // Level 101-120: 160 moves max
    } else if (level <= 140) {
        emptyCellsCount = 200;
        maxMoves = 170; // Level 121-140: 170 moves max
    } else if (level <= 150) {
        emptyCellsCount = 220;
        maxMoves = 180; // Level 141-150: 180 moves max
    } else {
        // For levels above 150, continue scaling with larger increments
        let levelGroup = Math.floor((level - 1) / 10);  // Groups of 10 levels after level 150
        emptyCellsCount = 220 + levelGroup * 20;  // Increase empty cells aggressively
        maxMoves = 180 + levelGroup * 20;  // Increase max moves aggressively
    }

    generateGrid(emptyCellsCount);
}

// Check the solution and provide feedback
function checkSolution() {
    const inputs = document.querySelectorAll('input');
    let isCorrect = true;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const value = parseInt(inputs[i].value);

        if (value !== solvedGrid[row][col] && solvedGrid[row][col] !== 0) {
            inputs[i].classList.add('incorrect');
            isCorrect = false;
        } else if (value === solvedGrid[row][col]) {
            inputs[i].classList.add('correct');
        } else {
            inputs[i].classList.remove('incorrect');
            inputs[i].classList.remove('correct');
        }

        // Remove the visual check (correct/incorrect) after 2 seconds
        setTimeout(() => {
            inputs[i].classList.remove('incorrect');
            inputs[i].classList.remove('correct');
        }, 2000);
    }

// Check if the solution is correct

    if (isCorrect) {
        stopTimer();
        alert('🎉 Congratulations! Level ' + level + ' complete.');
        level++;
        moves = 0; // Reset moves
        document.getElementById('moves-display').textContent = `Moves: ${moves}`; // Reset moves display
        autoPickDifficulty();
        document.getElementById('hint-button').disabled = false;

        // Reset hints every 5 levels
        if (level % 5 === 0) {
            hintUsed = 0;
        }
    } else {
        alert('❌ There are some mistakes. Try again!');
    }
}

// Provide a hint by filling in a random empty cell
function provideHint() {
    if (hintUsed >= 3) {
        alert('⚠️ Maximum 3 hints allowed per level!');
        return;
    }

    const emptyCells = [];
    const inputs = document.querySelectorAll('input');

    for (let i = 0; i < gridSize * gridSize; i++) {
        if (!inputs[i].value && !inputs[i].disabled) {
            emptyCells.push(i);
        }
    }

    // Randomly select an empty cell to fill with a hint
    if (emptyCells.length > 0) {
        const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const row = Math.floor(randomCellIndex / gridSize);
        const col = randomCellIndex % gridSize;

        inputs[randomCellIndex].value = solvedGrid[row][col];
        inputs[randomCellIndex].disabled = true;
        hintUsed++;

        if (hintUsed >= 3) {
            document.getElementById('hint-button').disabled = true;
        }
    }
}

// Undo the last move
function undo() {
    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value && !inputs[i].disabled) {
            undoStack.push({
                row: Math.floor(i / gridSize),
                col: i % gridSize,
                value: inputs[i].value
            });
            inputs[i].value = '';
        }
    }
}

// Restart the puzzle
function restartPuzzle() {
    level = 1;
    hintUsed = 0;
    undoStack = [];
    moves = 0;
    maxMoves = 25; // Reset max moves for restart
    document.getElementById('moves-display').textContent = `Moves: ${moves}`; // Reset moves display
    generateGrid(50); // Default difficulty for restart
    document.getElementById('hint-button').disabled = false;
    stopTimer();
    startTimer();
}

// Show the number of moves made
// Show rules at the start
function showRules() {
    const alertBox = document.createElement('div');
    alertBox.innerText = `🧠 Sudoku Rules:
1️⃣ Each row must contain the numbers 1-${gridSize}, no repeats.
2️⃣ Each column must also contain the numbers 1-${gridSize}, no repeats.
3️⃣ Each ${Math.sqrt(gridSize)}x${Math.sqrt(gridSize)} box must contain the numbers 1-${gridSize}, no repeats.
⚡ Use logic and deduction to fill in the empty cells.
👍 No guessing! Only valid moves.`;

    // Style the alert box
    Object.assign(alertBox.style, {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#000',
        color: '#fff',
        padding: '20px',
        border: '2px solid #444',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(255,255,255,0.2)',
        zIndex: 1000,
        whiteSpace: 'pre-line',
        opacity: '0',
        transition: 'opacity 0.5s ease'
    });

    document.body.appendChild(alertBox);

    // Trigger fade-in
    requestAnimationFrame(() => {
        alertBox.style.opacity = '1';
    });

    // Fade-out after 1.5s and remove after 2s
    setTimeout(() => {
        alertBox.style.opacity = '0';
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
document.getElementById("restart-button").addEventListener("click", restartPuzzle);
document.getElementById("check-button").addEventListener("click", checkSolution);
document.getElementById("hint-button").addEventListener("click", provideHint);
document.getElementById("undo-button").addEventListener("click", undo);
