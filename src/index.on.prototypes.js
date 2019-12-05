import './style.scss';

(function FifteenInit() {
  function Fifteen(selector) {
    this.selector = selector;
    this.gameField = document.querySelector(this.selector);
    this.sequence = this.initSequence();
  }

  Fifteen.prototype.EMPTY_CELL_VALUE = 16;

  /**
   * @return {boolean}
   */
  Fifteen.prototype.isWin = function FifteenIsWin() {
    const sequenceLength = this.sequence.length;
    for (let i = 0; i < sequenceLength - 1; i += 1) {
      if (parseInt(this.sequence[i + 1], 10) <= parseInt(this.sequence[i], 10)) {
        return false;
      }
    }
    return true;
  };

  Fifteen.prototype.onWinAction = function FifteenOnWinAction() {
    // eslint-disable-next-line no-alert
    alert('Congratulations! You are win the game!!');
  };

  Fifteen.prototype.checkWinTheGame = function FifteenCheckWinTheGame() {
    if (this.isWin()) {
      this.onWinAction();
    }
  };

  /**
   * @return {boolean}
   */
  Fifteen.prototype.isEmptyCell = function FifteenIsEmptyCell(number) {
    return parseInt(number, 10) === this.EMPTY_CELL_VALUE;
  };

  Fifteen.prototype.getCellNode = function FifteenGetCellNode(number) {
    return this.gameField.querySelector(`[data-number="${number}"]`);
  };

  Fifteen.prototype.getEmptyCellNode = function FifteenGetEmptyCellNode() {
    return this.getCellNode(this.EMPTY_CELL_VALUE);
  };

  Fifteen.prototype.initSequence = function FifteenCreateSequence() {
    const sequence = [];
    for (let i = 1; i <= this.EMPTY_CELL_VALUE; i += 1) {
      sequence.push(String(i));
    }
    return sequence;
  };

  Fifteen.prototype.updateSequence = function FifteenUpdateSequence() {
    const gameFieldCells = this.gameField.querySelectorAll('.fifteen-is-game__field-inner > div');
    const sequence = [];
    for (let i = 0; i < gameFieldCells.length; i += 1) {
      sequence.push(String(gameFieldCells[i].dataset.number));
    }
    this.sequence = sequence;
    this.checkWinTheGame();
  };

  Fifteen.prototype.shuffleSequence = function FifteenShuffleSequence() {
    for (let i = this.sequence.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.sequence[i], this.sequence[j]] = [this.sequence[j], this.sequence[i]];
    }
  };

  /**
   * @return {number}
   */
  Fifteen.prototype.getCellPosition = function FifteenGetCellPosition(number) {
    return this.sequence.indexOf(String(number));
  };

  /**
   * @return {number}
   */
  Fifteen.prototype.getEmptyCellPosition = function FifteenGetEmptyCellPosition() {
    return this.getCellPosition(this.EMPTY_CELL_VALUE);
  };

  Fifteen.prototype.calculateCellPositionXY = function FifteenCalculateCellPositionXY(index) {
    const x = index % 4;
    const y = Math.floor(index / 4);
    return { x, y };
  };

  Fifteen.prototype.isBesideEmptyCell = function FifteenIsBesideEmptyCell(number) {
    const cellIndex = this.getCellPosition(number);
    const cellPosition = this.calculateCellPositionXY(cellIndex);
    const emptyCellIndex = this.getEmptyCellPosition();
    const emptyCellPosition = this.calculateCellPositionXY(emptyCellIndex);

    const isOnLine = (cellPosition.x === emptyCellPosition.x
      || cellPosition.y === emptyCellPosition.y);
    const isBesideRow = (cellPosition.x === emptyCellPosition.x - 1
      || cellPosition.x === emptyCellPosition.x + 1);
    const isBesideCol = (cellPosition.y === emptyCellPosition.y - 1
      || cellPosition.y === emptyCellPosition.y + 1);

    return isOnLine && (isBesideRow || isBesideCol);
  };

  Fifteen.prototype.swapCellWithEmpty = function FifteenSwapCellWithEmpty(number) {
    if (this.isBesideEmptyCell(number)) {
      const cellNode = this.getCellNode(number);
      const emptyCellNode = this.getEmptyCellNode();
      const clonedEmptyCellNode = emptyCellNode.cloneNode(true);
      const cellsParent = emptyCellNode.parentNode;
      cellsParent.replaceChild(clonedEmptyCellNode, cellNode);
      cellsParent.replaceChild(cellNode, emptyCellNode);
      this.updateSequence();
    }
  };

  Fifteen.prototype.drawGameFieldCell = function FifteenDrawGameFieldCell(number) {
    const gameFieldCell = document.createElement('div');
    gameFieldCell.dataset.number = number;

    if (this.isEmptyCell(number)) {
      gameFieldCell.classList.add('fifteen-is-game__field-cell', 'fifteen-is-game__field-cell_empty');
    } else {
      gameFieldCell.classList.add('fifteen-is-game__field-cell', 'fifteen-is-game__field-cell_with-number');
      gameFieldCell.innerHTML = `<div class="fifteen-is-game__field-cell-number">${number}</div>`;
      gameFieldCell.onclick = (e) => {
        const element = e.currentTarget;
        this.swapCellWithEmpty(element.dataset.number);
      };
    }
    return gameFieldCell;
  };

  Fifteen.prototype.drawGameFieldInner = function FifteenDrawGameFieldInner() {
    const gameFieldInner = document.createElement('div');
    gameFieldInner.classList.add('fifteen-is-game__field-inner');

    this.sequence.forEach((number) => {
      const gameFieldCell = this.drawGameFieldCell(number);
      gameFieldInner.append(gameFieldCell);
    });

    return gameFieldInner;
  };

  Fifteen.prototype.drawGameField = function FifteenDrawGameField() {
    const gameField = document.createElement('div');
    gameField.classList.add('fifteen-is-game__field');

    const gameFieldInner = this.drawGameFieldInner();
    gameField.append(gameFieldInner);

    while (this.gameField.firstChild) {
      this.gameField.removeChild(this.gameField.firstChild);
    }
    this.gameField.append(gameField);
  };

  Fifteen.prototype.startTheGame = function FifteenStartTheGame() {
    this.shuffleSequence();
    this.drawGameField();
  };

  window.Fifteen = Fifteen;
}());
