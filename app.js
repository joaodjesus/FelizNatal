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
    'url(images/blue-candy.png)',
  ];

  // Criação do tabuleiro
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      const randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);

      // Adicionar eventos para toque
      square.addEventListener('touchstart', handleTouchStart, { passive: false });
      square.addEventListener('touchmove', handleTouchMove, { passive: false });
      square.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
  }
  createBoard();

  let startX, startY, startSquareId, endSquareId;

  function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startSquareId = parseInt(event.target.id);
  }

  function handleTouchMove(event) {
    event.preventDefault();
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      endSquareId = deltaX > 0 ? startSquareId + 1 : startSquareId - 1;
    } else {
      // Vertical swipe
      endSquareId = deltaY > 0 ? startSquareId + width : startSquareId - width;
    }

    if (endSquareId >= 0 && endSquareId < width * width) {
      swapSquares();
    }
  }

  function swapSquares() {
    const validMoves = [
      startSquareId - 1,
      startSquareId + 1,
      startSquareId - width,
      startSquareId + width,
    ];

    if (validMoves.includes(endSquareId)) {
      const colorDragged = squares[startSquareId].style.backgroundImage;
      const colorReplaced = squares[endSquareId].style.backgroundImage;

      squares[startSquareId].style.backgroundImage = colorReplaced;
      squares[endSquareId].style.backgroundImage = colorDragged;

      setTimeout(() => {
        checkMatches();
        moveIntoSquareBelow();
      }, 100);
    }
  }

  function updateScore(points) {
    score += points;
    scoreDisplay.innerHTML = score;

    console.log("Current score:", score); // Log to check score

    if (score >= 50) {
      showMessageAndRedirect();
    }
  }

  function showMessageAndRedirect() {
    // Show the congratulatory message
    const messageBox = document.createElement('div');
    messageBox.style.position = 'fixed';
    messageBox.style.top = '50%';
    messageBox.style.left = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageBox.style.color = 'white';
    messageBox.style.padding = '20px';
    messageBox.style.borderRadius = '10px';
    messageBox.style.fontSize = '24px';
    messageBox.style.textAlign = 'center';
    messageBox.style.zIndex = '1000';
    messageBox.innerHTML = 'És um espanto 😘';

    // Append the message box to the body
    document.body.appendChild(messageBox);

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'pagina8.html';  // Redirect to pagina8.html
    }, 2000); // Wait 2 seconds before redirecting
  }

  function moveIntoSquareBelow() {
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i + width].style.backgroundImage === '') {
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = '';
        const firstRow = Array.from({ length: width }, (_, idx) => idx);
        if (firstRow.includes(i) && squares[i].style.backgroundImage === '') {
          const randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = candyColors[randomColor];
        }
      }
    }
  }

  function checkMatches() {
    checkRowForThree();
    checkColumnForThree();
  }

  function checkRowForThree() {
    for (let i = 0; i < width * width - 2; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = Array.from({ length: width }, (_, idx) => width - 2 + idx * width);
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
    for (let i = 0; i < width * (width - 2); i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        updateScore(3);
        columnOfThree.forEach(index => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  setInterval(() => {
    checkMatches();
    moveIntoSquareBelow();
  }, 200);
});
