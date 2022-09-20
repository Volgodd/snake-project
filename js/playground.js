class Playground {
  PLAYGROUND_ID = "game-container__playground";
  CLUSTER_SIZE = 20;
  WIDTH_CLUSTERS = 41;
  HEIGHT_CLUSTERS = 21;

  FOOD_IMG = [];
  IMG_NAMES = ["cherry", "lemon", "orange", "strawberry", "watermelon"];
  FOOD_ID = "food_img";
  DRAWN_FOOD_X = 0;
  DRAWN_FOOD_Y = 0;

  SCORE = 0;
  SCORE_STEP = 10;

  LOCAL_STORAGE_NAME = "TTTTNAKEbestScore";
  HIGH_SCORE;
  HIGH_SCORE =
    localStorage.getItem(this.LOCAL_STORAGE_NAME) === null
      ? 0
      : localStorage.getItem(this.LOCAL_STORAGE_NAME);

  ALL_PLAYFIELD_CLUSTERS = [];
  PLAYGROUND_FREE_CLUSTERS;

  // для тестового кода, не используется в конечной версии
  PLAYFIELD_COORDS = [];
  CAN_ADD_COORDS = true;
  COMPARE_COORDS_SUCCESS;
  TEST_SNAKE_CORDS_COMPARE;

  constructor() {
    this.gameContainer = document.querySelector(".game-container");
    this.playField = document.createElement("div");
    this.playField.setAttribute("id", this.PLAYGROUND_ID);

    this.calculatedWidth = this.CLUSTER_SIZE * this.WIDTH_CLUSTERS;
    this.calculatedHeight = this.CLUSTER_SIZE * this.HEIGHT_CLUSTERS;

    this.playField.style.cssText += `--cluster-size: ${this.CLUSTER_SIZE}px; --width-clusters: ${this.WIDTH_CLUSTERS};  --height-clusters:  ${this.HEIGHT_CLUSTERS};`;

    this.gameContainer.appendChild(this.playField);

    this._generateAndPreloadImageArray();

    log("Playfield created");
  }

  freeClustersScope() {
    console.log("called");
    this.PLAYFIELD_COORDS = [];
    let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;

    for (let y = 0; y < this.HEIGHT_CLUSTERS * this.CLUSTER_SIZE; y += 20) {
      // console.log('Y: ', y)
      for (let x = 0; x < this.WIDTH_CLUSTERS * this.CLUSTER_SIZE; x += 20) {
        // console.log('X: ', x)
        //x: 0; y: 0
        for (let i = 0; i < snakeCoords.length; i++) {
          // console.log(`X: ${x} | Y: ${y}`);
          console.log("push made");

          if (snakeCoords[i].x !== x) {
            if (snakeCoords[i].y !== y) {
              this.PLAYFIELD_COORDS.push({ x, y });
            } else if (snakeCoords[i].y === y) {
              if (snakeCoords[i].x !== x) {
                this.PLAYFIELD_COORDS.push({ x, y });
              } else {
                console.log("1");
              }
            } else if (snakeCoords[i].x === x) {
              if (snakeCoords[i].y !== y) {
                this.PLAYFIELD_COORDS.push({ x, y });
              } else {
                console.log("2");
              }
            }
          }

          //           if (snakeCoords[i].x !== x) {
          //   if (snakeCoords[i].y !== y)
          //   this.PLAYFIELD_COORDS.push({x, y})
          // } else if (snakeCoords[i].x === x) {
          //     if (snakeCoords[i].y === y) {

          //     }
          // }

          // for(let y = 0; y < this.HEIGHT_CLUSTERS * this.CLUSTER_SIZE && (y === 0 || (y % 20 === 0)); y + 20) {
          //   console.log('Y: ', y)
          //   for(let x = 0; x < this.WIDTH_CLUSTERS * this.CLUSTER_SIZE && (x === 0 || (x % 20 === 0)); x + 20) {

          // if (snakeCoords[i].x !== x && snakeCoords[i].y !== y) {
          //   /// push shit here
          //   // console.log(`Comapring new X: ${x} with Snake's X: ${snakeCoords[i].x}`)
          //   this.PLAYFIELD_COORDS.push({x, y})
          // }

          // if (snakeCoords[i].x !== x || snakeCoords[i].y !== y) {
          //   console.log(`Comapring new X: ${x} with Snake's X: ${snakeCoords[i].x}`)
          //   if (snakeCoords[i].y !== y) {
          //   console.log(`Comapring new Y: ${y} with Snake's Y: ${snakeCoords[i].y}`)
          //   this.PLAYFIELD_COORDS.push({x, y})
          //   }
        }
      }
    }

    console.log(this.PLAYFIELD_COORDS);
  }

  generateAllPlayfieldClusters() {
    this.ALL_PLAYFIELD_CLUSTERS = [];
    for (let y = 0; y < this.HEIGHT_CLUSTERS * this.CLUSTER_SIZE; y += 20) {
      // console.log('Y: ', y)
      for (let x = 0; x < this.WIDTH_CLUSTERS * this.CLUSTER_SIZE; x += 20) {
        // console.log('X: ', x);
        this.ALL_PLAYFIELD_CLUSTERS.push({ x, y });
      }
    }
    // console.log(this.ALL_PLAYFIELD_CLUSTERS);
  }

  compareCoords(snakeX, snakeY, playfieldX, playfieldY) {
    if (snakeX !== playfieldX || snakeY !== playfieldY) {
      return (this.COMPARE_COORDS_SUCCESS = true);
    } 
      else {
      return (this.COMPARE_COORDS_SUCCESS = false);
    }
    // else if (snakeX === playfieldX || snakeY === playfieldY) {

    //   return false;
    // }
  }

  findClusters(clusters, index) {
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

  arrayContainsObject (allCoords, obj) {
    if (allCoords.some(e => e.x === obj.x && e.y === obj.y)) {
      return true 

      // this.CAN_ADD_COORDS = false;
      // this.TEST_SNAKE_CORDS_COMPARE = false;
      
    // } else
      // this.CAN_ADD_COORDS = true;
      // this.TEST_SNAKE_CORDS_COMPARE = true;
    }
  }

  generateFreeClusters() {
    this.generateAllPlayfieldClusters();
    this.PLAYGROUND_FREE_CLUSTERS = [];

    let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;
    let allClusters = this.ALL_PLAYFIELD_CLUSTERS;

    for (let i = 0; i < snakeCoords.length; i++) {
      let snakeCoordsObject = {x: snakeCoords[i].x, y: snakeCoords[i].y};
      // console.log(snakeCoordsObject);
      if (this.arrayContainsObject(allClusters, snakeCoordsObject)) {
        let index = allClusters.findIndex(i => {
          return i.x === snakeCoordsObject.x && i.y === snakeCoordsObject.y});
        // console.log(index)

        allClusters.splice(index, 1); 
      }
    }
    this.PLAYGROUND_FREE_CLUSTERS = allClusters;

    if (this.PLAYGROUND_FREE_CLUSTERS.length === 0) {

    }
  
  }

  freeClustersScopeVar2() {
    this.generateAllPlayfieldClusters();
    this.PLAYFIELD_COORDS = [];

    let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;
    let allClusters = this.ALL_PLAYFIELD_CLUSTERS;

    for (let i = 0; i < snakeCoords.length; i++) {
      for (let index = 0; index < allClusters.length; index++)  {
      let snakeCoordsObject = {x: snakeCoords[i].x, y: snakeCoords[i].y};
      let playgroundCoordsObject = {x: allClusters[index].x, y: allClusters[index].y};

      this.arrayContainsObject(allClusters, snakeCoordsObject);
      this.arrayContainsObject(this.PLAYFIELD_COORDS, playgroundCoordsObject);

      // this.arrayContainsObject(this.PLAYFIELD_COORDS, playgroundCoordsObject);
      // this.compareCoords(snakeCoords[i].x, snakeCoords[i].y, allClusters[index].x, allClusters[index].y)

      console.log(playgroundCoordsObject);
      console.log(snakeCoordsObject);

      // console.log(this.COMPARE_COORDS_SUCCESS);

        if (this.CAN_ADD_COORDS && this.TEST_SNAKE_CORDS_COMPARE)
          //this.COMPARE_COORDS_SUCCESS 
          // && this.CAN_ADD_COORDS
          {
            this.PLAYFIELD_COORDS.push(playgroundCoordsObject);

            console.log('push made')
            // this.arrayContainsObject(this.PLAYFIELD_COORDS, playgroundCoordsObject);

            // console.log(this.CAN_ADD_COORDS); 
            // if (this.CAN_ADD_COORDS) {

            //   this.PLAYFIELD_COORDS.push(playgroundCoordsObject);

            //   console.log('push made')
            // }
             
        } else {
          console.log('elseeeee')
        
      }

          // this.findClusters(allClusters, index, allClusters[index].x, allClusters[index].y);

          // if (this.CAN_ADD_COORDS) {
          //   // t
          // }
     } 
        
        // else {
        //   console.log("coords snake === coords playground, ");
        //   // this.PLAYFIELD_COORDS.push({
        //   //   x: allClusters[index].x,
        //   //   y: allClusters[index].y,
        //   //   });
        // }
      }

    console.log(this.PLAYFIELD_COORDS);

    // code is working. Problem is that coords duplicated: arr contains as much collection of pushed coords, as snake length
  }

  _generateAndPreloadImageArray() {
    for (let imageNameIndex in this.IMG_NAMES) {
      const imageName = this.IMG_NAMES[imageNameIndex];

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
    // const xCluster = this._randomIntFromInterval(0, this.WIDTH_CLUSTERS - 1);
    // const yCluster = this._randomIntFromInterval(0, this.HEIGHT_CLUSTERS - 1);

    // const xCoord = xCluster * this.CLUSTER_SIZE;
    // const yCoord = yCluster * this.CLUSTER_SIZE;

    // return { x: xCoord, y: yCoord };
    //этот код использовался до того, как появилась функция подсчета PLAYGROUND_FREE_CLUSTERS; 

    const randomCoordsObjectByIndex = Math.round(Math.random() * (this.PLAYGROUND_FREE_CLUSTERS.length - 1));

    return this.PLAYGROUND_FREE_CLUSTERS[randomCoordsObjectByIndex]
  }

  _drawRandomFoodImageAtCoords() {
    const chosenImageIndex = Math.round(
      Math.random() * (this.FOOD_IMG.length - 1)
    );
    const chosenImage = this.FOOD_IMG[chosenImageIndex];

    const { x, y } = this._getRandomFoodImageCoords();

    chosenImage.setAttribute("id", this.FOOD_ID);
    chosenImage.classList.add(this.FOOD_ID);
    chosenImage.style.cssText = `left: ${x}px; top: ${y}px;`;

    this.DRAWN_FOOD_X = x;
    this.DRAWN_FOOD_Y = y;

    this.playField.appendChild(chosenImage);
  }

  regenerateFoodImage() {
    const currentDrawnImageDom = document.getElementById(this.FOOD_ID);
    
    if (currentDrawnImageDom) {
      currentDrawnImageDom.remove();

      this.DRAWN_FOOD_X = 0;
      this.DRAWN_FOOD_Y = 0;
    };

    this.generateFreeClusters();

    if (this.PLAYGROUND_FREE_CLUSTERS.length !== 0) {
      this._drawRandomFoodImageAtCoords();
    } 
  }

  snakeCollidesWithFood({ currentSnakeX, currentSnakeY }) {
    if (
      currentSnakeX === this.DRAWN_FOOD_X &&
      currentSnakeY === this.DRAWN_FOOD_Y
    ) {

      this.generateFreeClusters();
      this.regenerateFoodImage();

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

  _renderScore(score) {
    const scoreDom = document.querySelector("h2 > span");
    scoreDom.innerHTML = score;
  }

  _renderScoreGameOver(score) {
    document.querySelector('.game-container__last-score > span'
    ).innerHTML = score;

    document.querySelector('.game-container__last-score--win > span'
    ).innerHTML = score;
  }

  renderHighScore(score) {
    this.HIGH_SCORE = Math.max(score, this.HIGH_SCORE);
    localStorage.setItem(this.LOCAL_STORAGE_NAME, this.HIGH_SCORE);
    document.querySelector("#high-score > span").innerHTML = this.HIGH_SCORE;
  }

  editScore(gameOver, reset, win) {
    if (!gameOver && !reset && !win) {
      this.SCORE += this.SCORE_STEP;
      this._renderScore(this.SCORE);
      this.renderHighScore(this.SCORE);
    } else if (gameOver && !reset && !win) {
      this._renderScore(this.SCORE);
      this._renderScoreGameOver(this.SCORE);
      this.renderHighScore(this.SCORE);
    } else if (!gameOver && reset && !win) {
      this.SCORE = 0;
      this._renderScore(this.SCORE);
    } else if (!gameOver && !reset && win) {
      this._renderScoreGameOver(this.SCORE);
      this._renderScore(this.SCORE);
      this._renderScoreGameOver(this.SCORE);
    }
    return;
  }
}
