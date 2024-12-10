// Adiciona um listener ao formulário para validar a resposta
document.addEventListener("DOMContentLoaded", () => {
  const desafioForm = document.getElementById("desafioForm");
  if (!desafioForm) return; // Garante que só executa em páginas com o formulário

  const respostasCorretas = {
    pagina1: "16 outubro",
    pagina2: ["sala 1.21", "sala da atec", "1.21"],
    pagina3: "arouca",
    pagina4: "barcelona",
    pagina5: ["3 de novembro", "3 novembro"],
    pagina6: ["sim"],
  };

  const currentPage = window.location.pathname.split("/").pop().split(".")[0];
  const respostaCorreta = respostasCorretas[currentPage];

  desafioForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const resposta = document.getElementById("resposta").value.trim().toLowerCase();
    const isCorrect = Array.isArray(respostaCorreta)
      ? respostaCorreta.includes(resposta)
      : resposta === respostaCorreta;

    if (isCorrect) {
      mostrarMensagem("success", "Resposta correta! A avançar...");
      setTimeout(() => {
        avancarParaProximaPagina(currentPage);
      }, 1000);
    } else {
      mostrarMensagem("alert", "Resposta errada! Tenta novamente.");
    }
  });
});

// Mostra a mensagem de sucesso ou erro
function mostrarMensagem(tipo, texto) {
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const mensagemErro = document.getElementById("mensagemErro");

  if (tipo === "success") {
    mensagemSucesso.textContent = texto;
    mensagemSucesso.classList.remove("hidden");
    mensagemErro.classList.add("hidden");
  } else if (tipo === "alert") {
    mensagemErro.textContent = texto;
    mensagemErro.classList.remove("hidden");
    mensagemSucesso.classList.add("hidden");
  }
}

// Redireciona para a próxima página com base na página atual
function avancarParaProximaPagina(currentPage) {
  const paginas = ["pagina1", "pagina2", "pagina3", "pagina4", "pagina5", "pagina6", "pagina7", "pagina8"];
  const nextPageIndex = paginas.indexOf(currentPage) + 1;

  if (nextPageIndex < paginas.length) {
    const nextPage = `${paginas[nextPageIndex]}.html`;
    window.location.href = nextPage;
  }
}








// game.js

const boardSize = 8;
const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];
let board = [];
let score = 0;
let movesLeft = 10;
let selectedPiece = null;

// Função para criar o tabuleiro
function createBoard() {
    const boardContainer = document.querySelector('.game-board');
    boardContainer.innerHTML = ''; // Limpar o tabuleiro

    board = [];
    for (let row = 0; row < boardSize; row++) {
        let rowArray = [];
        for (let col = 0; col < boardSize; col++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            rowArray.push(color);

            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.style.backgroundColor = color;
            piece.dataset.row = row;
            piece.dataset.col = col;

            piece.addEventListener('click', (e) => {
                e.preventDefault(); // Impedir comportamento padrão
                handlePieceClick(row, col);
            });

            boardContainer.appendChild(piece);
        }
        board.push(rowArray);
    }
}

// Função para clicar numa peça
function handlePieceClick(row, col) {
    if (selectedPiece) {
        const [selectedRow, selectedCol] = selectedPiece;

        // Verificar se as peças são adjacentes
        if (isAdjacent(row, col, selectedRow, selectedCol)) {
            swapPieces(row, col, selectedRow, selectedCol);

            if (hasMatch(row, col) || hasMatch(selectedRow, selectedCol)) {
                resolveMatches();
                movesLeft--;
                updateMoves();
            } else {
                // Troca inválida, reverter
                swapPieces(row, col, selectedRow, selectedCol);
                alert('Troca inválida!');
            }
        }

        // Limpar seleção
        selectedPiece = null;
    } else {
        selectedPiece = [row, col]; // Selecionar peça
    }
}

// Verificar se duas peças são adjacentes
function isAdjacent(row1, col1, row2, col2) {
    return (
        (Math.abs(row1 - row2) === 1 && col1 === col2) || // Verticalmente adjacente
        (Math.abs(col1 - col2) === 1 && row1 === row2)   // Horizontalmente adjacente
    );
}

// Trocar duas peças
function swapPieces(row1, col1, row2, col2) {
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    // Atualizar as cores no tabuleiro
    const piece1 = document.querySelector(`[data-row="${row1}"][data-col="${col1}"]`);
    const piece2 = document.querySelector(`[data-row="${row2}"][data-col="${col2}"]`);
    piece1.style.backgroundColor = board[row1][col1];
    piece2.style.backgroundColor = board[row2][col2];
}

// Verificar se há combinações numa posição
function hasMatch(row, col) {
    return findMatches(row, col, 'horizontal').length >= 3 ||
           findMatches(row, col, 'vertical').length >= 3;
}

// Encontrar combinações horizontais ou verticais
function findMatches(row, col, direction) {
    const color = board[row][col];
    const matches = [];

    if (direction === 'horizontal') {
        for (let i = col; i < boardSize && board[row][i] === color; i++) {
            matches.push([row, i]);
        }
        for (let i = col - 1; i >= 0 && board[row][i] === color; i--) {
            matches.push([row, i]);
        }
    } else {
        for (let i = row; i < boardSize && board[i][col] === color; i++) {
            matches.push([i, col]);
        }
        for (let i = row - 1; i >= 0 && board[i][col] === color; i--) {
            matches.push([i, col]);
        }
    }

    return matches;
}

// Resolver combinações
function resolveMatches() {
    const matchedPositions = [];

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const matches = [
                ...findMatches(row, col, 'horizontal'),
                ...findMatches(row, col, 'vertical'),
            ];

            if (matches.length >= 3) {
                matchedPositions.push(...matches);
            }
        }
    }

    matchedPositions.forEach(([row, col]) => {
        board[row][col] = null;
        const piece = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        piece.style.backgroundColor = 'transparent';
        updateScore(5); // Adicionar pontos
    });

    refillBoard();
}

// Reabastecer o tabuleiro com novas peças
function refillBoard() {
    for (let col = 0; col < boardSize; col++) {
        for (let row = boardSize - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = colors[Math.floor(Math.random() * colors.length)];
                const piece = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                piece.style.backgroundColor = board[row][col];
            }
        }
    }
}

// Atualizar a pontuação
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

// Atualizar o número de jogadas
function updateMoves() {
    document.getElementById('moves').textContent = movesLeft;

    if (movesLeft <= 0) {
        setTimeout(() => {
            alert('Confia Joca, tu consegues 😘');
            resetGame();
        }, 500);
    }

    if (score >= 3000) {
        setTimeout(() => {
            alert('Parabéns! És um espanto! 😍');
            window.location.href = 'pagina8.html';
        }, 500);
    }
}

// Reiniciar o jogo
function resetGame() {
    score = 0;
    movesLeft = 10;
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = movesLeft;
    createBoard();
}

// Mostrar o jogo
function showGame() {
    alert('Confia Joca, é fácil 😘');
    document.querySelector('.royal-match-container').style.display = 'block';
    resetGame();
}

// Eventos
document.getElementById('start-challenge').addEventListener('click', showGame);
document.getElementById('restart').addEventListener('click', resetGame);

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.royal-match-container').style.display = 'none';
});
