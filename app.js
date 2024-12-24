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
    }
  }
  createBoard();

  // Atualiza o score e verifica redirecionamentodocument.addEventListener('DOMContentLoaded', () => {
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
      square.setAttribute('id', i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);

      // Eventos de toque
      square.addEventListener('touchstart', touchStart);
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

  // Lógica de toque
  let startX, startY, startSquareId, endSquareId;

  function touchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startSquareId = parseInt(e.target.id);
  }

  function touchEnd(e) {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Determinar direção do toque
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento horizontal
      endSquareId = deltaX > 0 ? startSquareId + 1 : startSquareId - 1;
    } else {
      // Movimento vertical
      endSquareId = deltaY > 0 ? startSquareId + width : startSquareId - width;
    }

    // Verificar se o movimento é válido
    if (endSquareId >= 0 && endSquareId < width * width) {
      const colorBeingDragged = squares[startSquareId].style.backgroundImage;
      const colorBeingReplaced = squares[endSquareId].style.backgroundImage;

      // Trocar cores
      squares[endSquareId].style.backgroundImage = colorBeingDragged;
      squares[startSquareId].style.backgroundImage = colorBeingReplaced;

      // Validar movimento (podes melhorar com lógica adicional)
      setTimeout(() => {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
      }, 100);
    }
  }

  // Move candies para baixo
  function moveIntoSquareBelow() {
    for (let i = 0; i < 55; i++) {
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

  // Verificações para Matches
  function checkRowForFour() {
    for (let i = 0; i < 60; i++) {
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

  function checkColumnForFour() {
    for (let i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(4);
        columnOfFour.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  function checkRowForThree() {
    for (let i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(3);
        rowOfThree.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  function checkColumnForThree() {
    for (let i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(3);
        columnOfThree.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  // Intervalo para verificações contínuas
  window.setInterval(function () {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }, 100);
});

  function updateScore(points) {
    score += points;
    scoreDisplay.innerHTML = score;

    if (score >= 50) {
      alert("ÉS UM ESPANTO 😘"); // Mostra a mensagem
      window.location.href = 'pagina8.html'; // Redireciona para pagina8.html
    }
  }

  // Dragging the Candy
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

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

  // Verificações para Matches
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

  function checkColumnForFour() {
    for (i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(4);
        columnOfFour.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  function checkRowForThree() {
    for (i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(3);
        rowOfThree.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(3);
        columnOfThree.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  // Intervalo para executar verificações continuamente
  window.setInterval(function () {
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }, 100);
});


