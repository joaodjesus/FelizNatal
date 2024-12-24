document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const width = 8;
  const squares = [];
  let score = 0;

  const candyColors = [
    'url(images/red-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/green-candy.png)',
    'url(images/blue-candy.png)'
  ];

  // Cria o tabuleiro
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('draggable', true);
      square.setAttribute('id', i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);

      // Add touch support
      square.addEventListener('touchstart', touchStart);
      square.addEventListener('touchmove', touchMove);
      square.addEventListener('touchend', touchEnd);
    }
  }
  createBoard();

  // Atualiza o score e verifica redirecionamento
  function updateScore(points) {
    score += points;
    scoreDisplay.innerHTML = score;

    if (score >= 50) {
      alert("ÉS UM ESPANTO 😘");
      window.location.href = 'pagina8.html';
    }
  }

  // Dragging the Candy
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  // Add touch variables
  let startX, startY, endX, endY;

  squares.forEach(square => square.addEventListener('dragstart', dragStart));
  squares.forEach(square => square.addEventListener('dragend', dragEnd));
  squares.forEach(square => square.addEventListener('dragover', dragOver));
  squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  squares.forEach(square => square.addEventListener('dragleave', dragLeave));
  squares.forEach(square => square.addEventListener('drop', dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    this.style.backgroundImage = '';
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  function dragEnd() {
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width
    ];
    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  // Touch Handlers
  function touchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    const square = e.target;
    colorBeingDragged = square.style.backgroundImage;
    squareIdBeingDragged = parseInt(square.id);
  }

  function touchMove(e) {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
  }

  function touchEnd(e) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine direction
    if (absDeltaX > absDeltaY) {
      // Horizontal Swipe
      squareIdBeingReplaced = deltaX > 0 ? squareIdBeingDragged + 1 : squareIdBeingDragged - 1;
    } else {
      // Vertical Swipe
      squareIdBeingReplaced = deltaY > 0 ? squareIdBeingDragged + width : squareIdBeingDragged - width;
    }

    if (squareIdBeingReplaced >= 0 && squareIdBeingReplaced < width * width) {
      colorBeingReplaced = squares[squareIdBeingReplaced].style.backgroundImage;
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
      dragEnd(); // Reuse dragEnd logic
    }
  }

  // Move candies para baixo
  function moveIntoSquareBelow() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage === '') {
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = '';
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === '') {
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = candyColors[randomColor];
        }
      }
    }
  }

  // Verificações para Matches (as existentes)
  function checkRowForFour() {
    for (i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
      if (notValid.includes(i)) continue;

      if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(4);
        rowOfFour.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  // (As restantes funções `checkColumnForFour`, `checkRowForThree`, etc.)

  // Intervalo para verificações contínuas
  window.setInterval(function () {
    checkRowForFour();
    // (Adicione as outras funções aqui)
    moveIntoSquareBelow();
  }, 100);
});
