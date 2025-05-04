const sudokuGrid = document.querySelector('.sudoku-grid');
const newGameBtn = document.getElementById('new-game-btn');

let board = [];
let solution = []; // A teljes megoldás tárolására

// Egy előre definiált, érvényes Sudoku tábla (példa)
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
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.addEventListener('input', handleInput);

            if (initialBoard[i][j] !== '') {
                input.value = initialBoard[i][j];
                input.classList.add('fixed');
                input.readOnly = true; // A kezdeti számokat ne lehessen módosítani
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
        // Itt lehetne ellenőrizni a szabályokat valós időben
        const rowIndex = Math.floor(Array.from(sudokuGrid.children).indexOf(input.parentNode) / 9);
        const colIndex = Array.from(input.parentNode.children).indexOf(input);
        board[rowIndex][colIndex] = value;
    } else {
        input.value = ''; // Érvénytelen karakter esetén töröljük
    }
}

function generatePuzzle(solvedBoard, difficulty = 0.5) {
    const puzzle = solvedBoard.map(row => [...row]); // A megoldás másolata
    const cellsToRemove = Math.floor(81 * difficulty);
    let removedCount = 0;

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

function startNewGame() {
    solution = solvedBoard.map(row => [...row]); // A megoldás tárolása
    const puzzle = generatePuzzle(solution, 0.6); // Nehézségi szint állítható (0-1 közötti érték)
    board = puzzle.map(row => [...row]); // A játék táblájának beállítása a feladvánnyal
    createGrid(puzzle);
}

newGameBtn.addEventListener('click', startNewGame);

// Indításkor létrehozzuk az első játékot
startNewGame();