const sudokuGrid = document.querySelector('.sudoku-grid');
const newGameBtn = document.getElementById('new-game-btn');
const checkBtn = document.getElementById('check-btn');

const feedbackModal = document.getElementById('feedbackModal');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');

let board = [];
let solution = [];

const solvedBoard = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

function generateEmptyBoard() {
    return Array(9).fill(null).map(() => Array(9).fill(''));
}

function createGrid(initialBoard) {
    sudokuGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.addEventListener('input', handleInput);

            if (initialBoard[i][j] !== '') {
                input.value = initialBoard[i][j];
                input.classList.add('fixed');
                input.readOnly = true;
            }

            cellDiv.appendChild(input);
            sudokuGrid.appendChild(cellDiv);
        }
    }
}

function handleInput(event) {
    const input = event.target;
    const value = input.value;
    if (value === '' || (value >= '1' && value <= '9')) {
        input.parentNode.classList.remove('incorrect');

        const cellDiv = input.parentNode;
        const rowIndex = parseInt(cellDiv.dataset.row);
        const colIndex = parseInt(cellDiv.dataset.col);

        board[rowIndex][colIndex] = value === '' ? '' : parseInt(value);
    } else {
        input.value = '';
    }
}

function generatePuzzle(solvedBoard, difficulty = 0.5) {
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = Math.floor(81 * difficulty);
    let removedCount = 0;

    // Create a shuffled array of all cell indices
    const allCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            allCells.push({ row: i, col: j });
        }
    }
    // Fisher-Yates shuffle
    for (let i = allCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    let attempts = 0;
    while (removedCount < cellsToRemove && attempts < allCells.length) {
        const { row, col } = allCells[attempts];
        const originalValue = puzzle[row][col];
        puzzle[row][col] = '';

        // Check if the puzzle still has a unique solution (very basic check)
        // This is a simplified check and might not catch all cases
        let possibleSolutions = 0;
        // A full Sudoku solver would be needed for a robust check
        const tempBoard = puzzle.map(r => r.map(v => v === '' ? 0 : v));
        if (isValidSudoku(tempBoard)) {
            // Very basic check: if removing this cell doesn't immediately invalidate the board
            // we assume it's likely still solvable (not a perfect check)
            removedCount++;
        } else {
            puzzle[row][col] = originalValue; // Restore if it seems to break the basic rules
        }
        attempts++;
    }
    return puzzle;
}

function isValidSudoku(board) {
    // Check rows
    for (let i = 0; i < 9; i++) {
        const row = new Set();
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            if (num !== 0) {
                if (row.has(num)) return false;
                row.add(num);
            }
        }
    }

    // Check columns
    for (let j = 0; j < 9; j++) {
        const col = new Set();
        for (let i = 0; i < 9; i++) {
            const num = board[i][j];
            if (num !== 0) {
                if (col.has(num)) return false;
                col.add(num);
            }
        }
    }

    // Check 3x3 subgrids
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            const subgrid = new Set();
            for (let row = i; row < i + 3; row++) {
                for (let col = j; col < j + 3; col++) {
                    const num = board[row][col];
                    if (num !== 0) {
                        if (subgrid.has(num)) return false;
                        subgrid.add(num);
                    }
                }
            }
        }
    }
    return true;
}


function checkSolution() {
    let correct = true;
    const cells = sudokuGrid.querySelectorAll('.cell');

    cells.forEach(cell => {
        const input = cell.querySelector('input');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = input.value === '' ? '' : parseInt(input.value);

        cell.classList.remove('incorrect');

        if (!input.readOnly && value !== '' && value !== solution[row][col]) {
            cell.classList.add('incorrect');
            correct = false;
        }
        if (!input.readOnly && value === '' && solution[row][col] !== '') {
            correct = false;
        }
    });

    if (correct) {
        showModal('Gratulálunk! A Sudoku sikeresen megoldva!');
    } else {
        showModal('Vannak még hibák a Sudoku táblán.');
    }
}

function showModal(message) {
    modalMessage.textContent = message;
    feedbackModal.style.display = 'flex';
}

function hideModal() {
    feedbackModal.style.display = 'none';
}

function startNewGame() {
    solution = solvedBoard.map(row => [...row]);
    const puzzle = generatePuzzle(solution, 0.3); // difficulty (0.1 - easy, 0.9 - hard)
    board = puzzle.map(row => [...row]);
    createGrid(puzzle);
    hideModal();
}

newGameBtn.addEventListener('click', startNewGame);
checkBtn.addEventListener('click', checkSolution);

closeButton.addEventListener('click', hideModal);

window.addEventListener('click', (event) => {
    if (event.target === feedbackModal) {
        hideModal();
    }
});

startNewGame();