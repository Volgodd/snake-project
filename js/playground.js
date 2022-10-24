class Playground {
  PLAYGROUND_ID = "game-container__playground";
  CLUSTER_SIZE = 20;
  WIDTH_CLUSTERS = 30;
  HEIGHT_CLUSTERS = 20;

  FOOD_IMG = [];
  DRAWN_FOOD_X = 0;
  DRAWN_FOOD_Y = 0;

  SCORE_GAME_OVER_DOM = document.querySelector(".game-container__last-score > span")
  SCORE_DOM = document.querySelector("h2 > span");
  SCORE = 0;
  SCORE_STEP = 10;

  COMPLETION_DOM = document.querySelector("#completion > span");
  COMPLETION = 0;

  PLAYGROUND_DOM = null;
  PLAYGROUND_CLUSTERS_ALL = [];
  PLAYGROUND_CLUSTERS_FREE;

  CAN_ADD_COORDS = true;
  COMPARE_COORDS_SUCCESS;
  TEST_SNAKE_CORDS_COMPARE;

  constructor() {
    const gameContainer = document.querySelector(".game-container");
    this.PLAYGROUND_DOM = document.createElement("div");
    this.PLAYGROUND_DOM.setAttribute("id", this.PLAYGROUND_ID);

    // this.calculatedWidth = this.CLUSTER_SIZE * this.WIDTH_CLUSTERS;
    // this.calculatedHeight = this.CLUSTER_SIZE * this.HEIGHT_CLUSTERS;

    gameContainer.style.cssText += `--cluster-size: ${this.CLUSTER_SIZE}px; --width-clusters: ${this.WIDTH_CLUSTERS};  --height-clusters:  ${this.HEIGHT_CLUSTERS};`;

    gameContainer.appendChild(this.PLAYGROUND_DOM);

    this._generateAndPreloadImageArray();
  }

  _generateAllPlaygroundClusters() {
    this.PLAYGROUND_CLUSTERS_ALL = [];

    for (let y = 0; y < this.HEIGHT_CLUSTERS * this.CLUSTER_SIZE; y += 20) {
      for (let x = 0; x < this.WIDTH_CLUSTERS * this.CLUSTER_SIZE; x += 20) {
        this.PLAYGROUND_CLUSTERS_ALL.push({ x, y });
      }
    }
  }

  _compareCoords(snakeX, snakeY, playgroundX, playgroundY) {
    if (snakeX !== playgroundX || snakeY !== playgroundY) {
      return (this.COMPARE_COORDS_SUCCESS = true);
    } else {
      return (this.COMPARE_COORDS_SUCCESS = false);
    }
  }

  _findClusters(clusters, index) {
    if (
      clusters.includes(
        clusters.find(
          (el) => el.x === clusters[index].x && el.y === clusters[index].y
        )
      )
    ) {
      return (this.CAN_ADD_COORDS = false);
    } else return (this.CAN_ADD_COORDS = true);

    // allClusters.includes(allClusters.find(el => el.x === allClusters[index].x && el.y === allClusters[index].y ))
  }

  _playgroundCoordsHasCoords(coordsObject) {
    if (this.PLAYGROUND_CLUSTERS_ALL.some((object) => object.x === coordsObject.x && object.y === coordsObject.y)) {
      return true;
    }

    return false
  }

  _generateFreeClusters() {
    this._generateAllPlaygroundClusters();
    this.PLAYGROUND_CLUSTERS_FREE = [];

    let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;
    let allClusters = this.PLAYGROUND_CLUSTERS_ALL;

    for (let i = 0; i < snakeCoords.length; i++) {
      const snakeCoordsObject = { x: snakeCoords[i].x, y: snakeCoords[i].y };

      if (this._playgroundCoordsHasCoords(snakeCoordsObject)) {
        const clusterIndex = allClusters.findIndex((i) => i.x === snakeCoordsObject.x && i.y === snakeCoordsObject.y);

        allClusters.splice(clusterIndex, 1);
      }
    }

    this.PLAYGROUND_CLUSTERS_FREE = allClusters;
  }

  _generateAndPreloadImageArray() {
    const imgNames = ["cherry", "lemon", "orange", "strawberry", "watermelon"];

    for (let imageNameIndex in imgNames) {
      const imageName = imgNames[imageNameIndex];

      const foodImage = new Image();
      foodImage.src = `img/${imageName}.png`;
      foodImage.width = this.CLUSTER_SIZE;
      foodImage.height = this.CLUSTER_SIZE;

      this.FOOD_IMG.push(foodImage);
    }
  }

  _randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  _getRandomFoodImageCoords() {
    const randomCoordsObjectByIndex = Math.round(
      Math.random() * (this.PLAYGROUND_CLUSTERS_FREE.length - 1)
    );

    return this.PLAYGROUND_CLUSTERS_FREE[randomCoordsObjectByIndex];
  }

  drawRandomFoodImage() {
    const foodId = "food_img";

    // detect existing food image and remove it
    const currentDrawnImageDom = document.getElementById(foodId);

    if (currentDrawnImageDom) {
      currentDrawnImageDom.remove();

      this.DRAWN_FOOD_X = 0;
      this.DRAWN_FOOD_Y = 0;
    }

    // generate free clusters for food generation
    this._generateFreeClusters();

    // generate new food image
    const chosenImageIndex = Math.round(
      Math.random() * (this.FOOD_IMG.length - 1)
    );

    const chosenImage = this.FOOD_IMG[chosenImageIndex];

    const { x, y } = this._getRandomFoodImageCoords();

    chosenImage.setAttribute("id", foodId);
    chosenImage.classList.add(foodId);
    chosenImage.style.cssText = `left: ${x}px; top: ${y}px;`;

    this.DRAWN_FOOD_X = x;
    this.DRAWN_FOOD_Y = y;

    this.PLAYGROUND_DOM.appendChild(chosenImage);
  }

  snakeCollidesWithFood({ currentSnakeX, currentSnakeY }) {
    if (
      currentSnakeX === this.DRAWN_FOOD_X &&
      currentSnakeY === this.DRAWN_FOOD_Y
    ) {
      this._generateFreeClusters();
      this.drawRandomFoodImage();

      return true;
    }

    return false;
  }

  _getCleanCenterByAxis(axis) {
    const operationAxis =
      axis === "x" ? this.WIDTH_CLUSTERS : this.HEIGHT_CLUSTERS;
    //либо можно написать так:
    //const operationAxis = axis === "x" && WIDTH_CLUSTERS || HEIGHT_CLUSTERS;

    return operationAxis % 2 === 0
      ? (operationAxis / 2) * this.CLUSTER_SIZE
      : ((operationAxis - 1) / 2) * this.CLUSTER_SIZE;
  }

  getID() {
    return this.PLAYGROUND_ID;
  }

  getClusterSize() {
    return this.CLUSTER_SIZE;
  }

  getCleanCenterCoords() {
    return {
      x: this._getCleanCenterByAxis("x"),
      y: this._getCleanCenterByAxis("y"),
    };
  }

  outOfBoundsIsTrue({ currentSnakeX, currentSnakeY }) {
    if (
      currentSnakeX < 0 ||
      currentSnakeY < 0 ||
      currentSnakeX > this.CLUSTER_SIZE * (this.WIDTH_CLUSTERS - 1) ||
      currentSnakeY > this.CLUSTER_SIZE * (this.HEIGHT_CLUSTERS - 1)
    ) {
      return true;
    }

    return false;
  }

  _renderScore(currentScore) {
    this.SCORE_DOM.innerHTML = currentScore;
  }

  _renderScoreGameOver(currentScore) {
    this.SCORE_GAME_OVER_DOM.innerHTML = currentScore;
  }

  renderHighScore(currentScore) {
    const localStorageNameScore = "TTTTNAKEbestScore";

    const highScore =
      localStorage.getItem(localStorageNameScore) === null
        ? 0
        : localStorage.getItem(localStorageNameScore);

    currentScore > highScore && localStorage.setItem(localStorageNameScore, highScore)
    // if currentScore > highScore - execute next code
  }

  renderCompletion(newGame) {
    if (!newGame) {
      this.COMPLETION =
        Math.round(
          (snake.SNAKE_SEGMENTS_COORDS.length /
            (this.WIDTH_CLUSTERS * this.HEIGHT_CLUSTERS)) *
            100 *
            10
        ) / 10;
    } else this.COMPLETION = 0;

    this.COMPLETION_DOM.innerHTML = this.COMPLETION;
  }

  editScore({gameOver, reset, win}) {
    if (!gameOver && !reset && !win) {
      this.SCORE += this.SCORE_STEP;
      this._renderScore(this.SCORE);
      this.renderHighScore(this.SCORE);
      this.renderCompletion();
    } else if (gameOver && !reset && !win) {
      this._renderScore(this.SCORE);
      this._renderScoreGameOver(this.SCORE);
      this.renderHighScore(this.SCORE);
    } else if (!gameOver && reset && !win) {
      this.SCORE = 0;
      this._renderScore(this.SCORE);
      this.renderCompletion(true);
    } else if (!gameOver && !reset && win) {
      this._renderScore(this.SCORE);
      this._renderScoreGameOver(this.SCORE);
    }
  }
}
