const boardSize = 6;
const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];
let board = [];
let score = 0;
let movesLeft = 10;
let isPlaying = false;
let selectedPiece = null;

document.getElementById('start-button').addEventListener('click', initializeGame);
document.getElementById('popup-close').addEventListener('click', startGame);

// Inicializar o jogo
function initializeGame() {
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('popup-container').style.display = 'block';
}

// Começar o jogo
function startGame() {
    isPlaying = true;
    document.getElementById('popup-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    createBoard();
    updateScore();
    updateMoves();
}

// Criar o tabuleiro
function createBoard() {
    const boardContainer = document.querySelector('.game-board');
    boardContainer.innerHTML = '';
    board = [];

    for (let row = 0; row < boardSize; row++) {
        let rowArray = [];
        for (let col = 0; col < boardSize; col++) {
            const color = getRandomColor();
            rowArray.push(color);

            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.style.backgroundColor = color;
            piece.dataset.row = row;
            piece.dataset.col = col;

            piece.addEventListener('click', () => handlePieceClick(row, col));
            boardContainer.appendChild(piece);
        }
        board.push(rowArray);
    }
}

// Obter uma cor aleatória
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Atualizar pontuação
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Atualizar jogadas restantes
function updateMoves() {
    document.getElementById('moves').textContent = movesLeft;
    if (movesLeft <= 0) {
        endGame();
    }
}

// Fim de jogo
function endGame() {
    if (score >= 3000) {
        alert('Parabéns! Você venceu!');
    } else {
        alert('Confia Joca, tu consegues 😘');
        resetGame();
    }
}

// Resetar o jogo
function resetGame() {
    score = 0;
    movesLeft = 10;
    createBoard();
    updateScore();
    updateMoves();
}

// Ação quando clicar numa peça
function handlePieceClick(row, col) {
    if (!isPlaying) return;

    if (selectedPiece) {
        const prevRow = selectedPiece.row;
        const prevCol = selectedPiece.col;

        // Verifica se é possível trocar as peças
        if (isValidMove(prevRow, prevCol, row, col)) {
            swapPieces(prevRow, prevCol, row, col);
            if (checkMatch(row, col) || checkMatch(prevRow, prevCol)) {
                score += 100;
                movesLeft--;
                updateScore();
                updateMoves();
                animateAndReplacePiece(prevRow, prevCol);
                animateAndReplacePiece(row, col);
            } else {
                setTimeout(() => {
                    swapPieces(prevRow, prevCol, row, col, true);
                }, 500);
            }
        }
        selectedPiece = null;
    } else {
        selectedPiece = { row, col };
    }
}

// Validar se a troca de peças é válida
function isValidMove(prevRow, prevCol, row, col) {
    return (Math.abs(prevRow - row) === 1 && prevCol === col) || (Math.abs(prevCol - col) === 1 && prevRow === row);
}

// Trocar as peças
function swapPieces(row1, col1, row2, col2, reset = false) {
    const tempColor = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = tempColor;

    document.querySelector(`[data-row='${row1}'][data-col='${col1}']`).style.backgroundColor = board[row1][col1];
    document.querySelector(`[data-row='${row2}'][data-col='${col2}']`).style.backgroundColor = board[row2][col2];

    if (reset) {
        // Se for um movimento inválido, volta às cores originais
        setTimeout(() => {
            document.querySelector(`[data-row='${row1}'][data-col='${col1}']`).style.backgroundColor = tempColor;
            document.querySelector(`[data-row='${row2}'][data-col='${col2}']`).style.backgroundColor = board[row2][col2];
        }, 500);
    }
}

// Verificar combinações
function checkMatch(row, col) {
    const color = board[row][col];
    const horizontalMatch = checkHorizontalMatch(row, col, color);
    const verticalMatch = checkVerticalMatch(row, col, color);
    return horizontalMatch || verticalMatch;
}

// Verificar combinação horizontal
function checkHorizontalMatch(row, col, color) {
    let count = 0;
    for (let i = col; i < boardSize && board[row][i] === color; i++) count++;
    for (let i = col - 1; i >= 0 && board[row][i] === color; i--) count++;
    return count >= 3;
}

// Verificar combinação vertical
function checkVerticalMatch(row, col, color) {
    let count = 0;
    for (let i = row; i < boardSize && board[i][col] === color; i++) count++;
    for (let i = row - 1; i >= 0 && board[i][col] === color; i--) count++;
    return count >= 3;
}

// Animação de desaparecimento e substituição das peças
function animateAndReplacePiece(row, col) {
    const piece = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    piece.style.opacity = 0;
    setTimeout(() => {
        piece.style.opacity = 1;
        piece.style.backgroundColor = getRandomColor();
    }, 300);
}
