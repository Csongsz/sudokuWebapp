const sudokuGrid = document.querySelector('.sudoku-grid');
const newGameBtn = document.getElementById('new-game-btn');
const checkBtn = document.getElementById('check-btn');

// Get modal elements
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
        // Remove any incorrect class when input changes
        input.parentNode.classList.remove('incorrect');

        const cellDiv = input.parentNode;
        const rowIndex = parseInt(cellDiv.dataset.row);
        const colIndex = parseInt(cellDiv.dataset.col);

        board[rowIndex][colIndex] = value === '' ? '' : parseInt(value);
    } else {
        input.value = '';
    }
}

function generatePuzzle(solvedBoard) {
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = Math.floor(81 * 0.5);
    let removedCount = 0;

    // Simple removal, doesn't guarantee unique solution or specific difficulty
    while (removedCount < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== '') {
            puzzle[row][col] = '';
            removedCount++;
        }
    }
    return puzzle;
}

function checkSolution() {
    let correct = true;
    const cells = sudokuGrid.querySelectorAll('.cell');

    cells.forEach(cell => {
        const input = cell.querySelector('input');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = input.value === '' ? '' : parseInt(input.value);

        // Remove previous incorrect highlighting
        cell.classList.remove('incorrect');

        // Only check non-fixed cells and if they have a value
        if (!input.readOnly && value !== '' && value !== solution[row][col]) {
            cell.classList.add('incorrect');
            correct = false;
        }
        // Also check if a non-fixed cell is empty but should have a value
        if (!input.readOnly && value === '' && solution[row][col] !== '') {
            // Optionally highlight missing required values differently or just count them as incorrect
            correct = false; // Treat missing required as incorrect
        }
    });

    if (correct) {
        showModal('Gratulálunk! A megoldás helyes!');
    } else {
        showModal('Vannak hibák a megoldásban.');
    }
}

// Function to display the modal
function showModal(message) {
    modalMessage.textContent = message;
    feedbackModal.style.display = 'flex'; // Use flex to center
}

// Function to hide the modal
function hideModal() {
    feedbackModal.style.display = 'none';
}

function startNewGame() {
    solution = solvedBoard.map(row => [...row]);
    const puzzle = generatePuzzle(solution, 0.6);
    board = puzzle.map(row => [...row]);
    createGrid(puzzle);
    hideModal(); // Hide modal on new game
}

newGameBtn.addEventListener('click', startNewGame);
checkBtn.addEventListener('click', checkSolution);

// Event listeners to close the modal
closeButton.addEventListener('click', hideModal);

// Close the modal if the user clicks outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === feedbackModal) {
        hideModal();
    }
});


startNewGame();