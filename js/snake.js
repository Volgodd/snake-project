class Snake {
  SNAKE_ID_PREFIX = "snake";
  SNAKE_SEGMENT_CLASS_NAME = "snake-segment";
  SNAKE_SEGMENTS_COORDS = []; //{x: int, y: int}

  constructor(playgroundID, clusterSize, initialCoords) {
    this.clusterSize = clusterSize;
    this.initialCoords = initialCoords;
    this.playgroundDom = document.getElementById(playgroundID);
  }

  getSegmentCoordsByIndex(index) {
    const { x, y } = this.SNAKE_SEGMENTS_COORDS[index];
    return { currentSnakeX: x, currentSnakeY: y };
  }

  _generatePositionCSS({ x, y }) {
    return `--x-coord: ${x}px; --y-coord: ${y}px;`;
  }

  _createSnakeSegmentAt({ x, y }) {
    const snakeSegmentDom = document.createElement("div");

    snakeSegmentDom.setAttribute(
      "id",
      `${this.SNAKE_ID_PREFIX}-${this.SNAKE_SEGMENTS_COORDS.length + 1}`
    );
    snakeSegmentDom.classList.add(this.SNAKE_SEGMENT_CLASS_NAME);
    snakeSegmentDom.style.cssText = this._generatePositionCSS({ x, y });

    this.playgroundDom.appendChild(snakeSegmentDom);

    this.SNAKE_SEGMENTS_COORDS.push({ x, y });
  }

  /**
   * Detects length for boost speed
   * @param {engine.TICK_SPEED}  tick speed of a game
   * @param {playground.COMPLETION} curent completion
   * @returns boolean
   */

  snakeLengthForBoost() {
    if (
      engine.TICK_SPEED > 100 &&
      playground.COMPLETION >= 2 &&
      playground.COMPLETION % 2 === 0
    ) {
      return true;
    }
    return false;
  }

  _clearAllSnakeSegments() {
    const snakeSegmentCollection = document.querySelectorAll(
      `.${this.SNAKE_SEGMENT_CLASS_NAME}`
    );

    for (let i = 0; i < snakeSegmentCollection.length; i++) {
      snakeSegmentCollection[i].remove();
    }

    this.SNAKE_SEGMENTS_COORDS = [];
  }

  grow() {
    const { currentSnakeX: x, currentSnakeY: y } =
      this.getSegmentCoordsByIndex(0);
    this._createSnakeSegmentAt({ x, y });
  }

  reset() {
    this._clearAllSnakeSegments();

    const { x, y } = this.initialCoords;
    this._createSnakeSegmentAt({ x, y });
    this.grow();

    const headSegment = document.querySelector(`#${this.SNAKE_ID_PREFIX}-1`);
    const snakeFaceImg = document.createElement("img");

    snakeFaceImg.setAttribute("src", "img/face.png");
    snakeFaceImg.setAttribute("id", `${this.SNAKE_ID_PREFIX}-1--face-img`);

    headSegment.appendChild(snakeFaceImg);
  }

  _moveBySnakeSegmentIndex(index, newPotentialSnakeX, newPotentialSnakeY) {
    const currentSnakeSegmentDom = document.querySelector(
      `#${this.SNAKE_ID_PREFIX}-${index + 1}`
    );

    let newSnakeX = newPotentialSnakeX;
    let newSnakeY = newPotentialSnakeY;

    if (index === 0) {
      currentSnakeSegmentDom.style.cssText = this._generatePositionCSS({
        x: newSnakeX,
        y: newSnakeY,
      });
    } else {
      const {
        currentSnakeX: previousClusterX,
        currentSnakeY: previousClusterY,
      } = this.getSegmentCoordsByIndex(index - 1);

      newSnakeX = previousClusterX;
      newSnakeY = previousClusterY;

      currentSnakeSegmentDom.style.cssText = this._generatePositionCSS({
        x: newSnakeX,
        y: newSnakeY,
      });
    }

    this.SNAKE_SEGMENTS_COORDS[index] = { x: newSnakeX, y: newSnakeY };
  }

  move(direction, DIRECTIONS) {
    const { currentSnakeX, currentSnakeY } = this.getSegmentCoordsByIndex(0);

    let newSnakeX = currentSnakeX;
    let newSnakeY = currentSnakeY;

    // если змея двигается по оси Х, тогда нам нужна дефолтная координата Y, в противном случае при логинге она будет indefined, т.к. не получает значение, именно поэтому выше указаны значение переменных newSnakeX и newSnakeY

    if (direction === DIRECTIONS.RIGHT) {
      newSnakeX = newSnakeX + this.clusterSize;
    } else if (direction === DIRECTIONS.LEFT) {
      newSnakeX = newSnakeX - this.clusterSize;
    } else if (direction === DIRECTIONS.UP) {
      newSnakeY = newSnakeY - this.clusterSize;
    } else if (direction === DIRECTIONS.DOWN) {
      newSnakeY = newSnakeY + this.clusterSize;
    }

    for (
      let index = this.SNAKE_SEGMENTS_COORDS.length - 1;
      index >= 0;
      index--
    ) {
      this._moveBySnakeSegmentIndex(index, newSnakeX, newSnakeY);
    }
  }

  turnHead(oppositeDir, currentDirection, DIRECTIONS) {
    const head = document.querySelector(`#${this.SNAKE_ID_PREFIX}-1`);

    const snakeSegmentClassList = "snake-segment";
    const headLeft = "--head-left";
    const headRight = "--head-left";
    const headUp = "--head-up";
    const headDown = "--head-down";

    if (oppositeDir && currentDirection === DIRECTIONS.LEFT) {
      head.classList.remove(
        `${snakeSegmentClassList}${headUp}`,
        `${snakeSegmentClassList}${headDown}`
      );
      head.classList.add(`${snakeSegmentClassList}${headLeft}`);
    } else if (oppositeDir && currentDirection === DIRECTIONS.UP) {
      head.classList.remove(
        `${snakeSegmentClassList}${headLeft}`,
        `${snakeSegmentClassList}${headDown}`
      );
      head.classList.add(`${snakeSegmentClassList}${headUp}`);
    } else if (oppositeDir && currentDirection === DIRECTIONS.DOWN) {
      head.classList.remove(
        `${snakeSegmentClassList}${headUp}`,
        `${snakeSegmentClassList}${headLeft}`
      );
      head.classList.add(`${snakeSegmentClassList}${headDown}`);
    } else if (oppositeDir && currentDirection === DIRECTIONS.RIGHT) {
      head.classList.remove(
        `${snakeSegmentClassList}${headUp}`,
        `${snakeSegmentClassList}${headDown}`,
        `${snakeSegmentClassList}${headLeft}`
      );
    }
  }

  _getTailDirection() {
    const currentTailIndex = this.SNAKE_SEGMENTS_COORDS.length - 1;
    const previousTailIndex = this.SNAKE_SEGMENTS_COORDS.length - 2;

    const { x: tailX, y: tailY } = this.SNAKE_SEGMENTS_COORDS[currentTailIndex];
    //переименовать переменные при деструктуризации, переменные  x и y не существуют, потому что они переименованы

    const { x: beforeTailX, y: beforeTailY } =
      this.SNAKE_SEGMENTS_COORDS[previousTailIndex];

    if (tailX === beforeTailX && tailY > beforeTailY) {
      return "up";
    } else if (tailX === beforeTailX && tailY < beforeTailY) {
      return "down";
    } else if (tailY === beforeTailY && tailX < beforeTailX) {
      return "right";
    } else if (tailY === beforeTailY && tailX > beforeTailX) {
      return "left";
    }
  }

  tailRotation() {
    const currentTailDom = document.querySelector(
      `#${this.SNAKE_ID_PREFIX}-${this.SNAKE_SEGMENTS_COORDS.length}`
    );

    const previousTailDom = document.querySelector(
      `#${this.SNAKE_ID_PREFIX}-${this.SNAKE_SEGMENTS_COORDS.length - 1}`
    );

    const classLeft = "border-radius-left";
    const classRight = "border-radius-right";
    const classUp = "border-radius-top";
    const classDown = "border-radius-bottom";

    const direction = this._getTailDirection();

    if (direction === "up") {
      currentTailDom.classList.add(classUp);
      currentTailDom.classList.remove(classRight, classDown, classLeft);
    } else if (direction === "down") {
      currentTailDom.classList.add(classDown);
      currentTailDom.classList.remove(classRight, classUp, classLeft);
    } else if (direction === "left") {
      currentTailDom.classList.add(classLeft);
      currentTailDom.classList.remove(classRight, classUp, classDown);
    } else if (direction === "right") {
      currentTailDom.classList.add(classRight);
      currentTailDom.classList.remove(classDown, classUp, classLeft);
    }

    previousTailDom.classList.remove(classRight, classDown, classLeft, classUp);
  }

  selfCollides() {
    const { x: headSegmentCoordsX, y: headSegmentCoordsY } =
      this.SNAKE_SEGMENTS_COORDS[0];

    for (let index = 1; index < this.SNAKE_SEGMENTS_COORDS.length; index++) {
      const { x, y } = this.SNAKE_SEGMENTS_COORDS[index];

      if (x === headSegmentCoordsX && y === headSegmentCoordsY) {
        return true;
      }
    }

    return false;
  }
}
