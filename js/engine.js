class Engine {
  DIRECTIONS = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
  };

  #CAN_TURN_THIS_TICK = true;
  CURRENT_DIRECTION = "right";
  MOVE_TIMER;

  START_TICK_SPEED = 300;
  
  TICK_SPEED = this.START_TICK_SPEED;

  constructor(snake, playground) {
    this.snake = snake;

    this.playground = playground;

    this._setUpButtons();
  }

  _safeguardOppositeDirections(newPotentialDirection) {
    // объект с противолоположностями
    // {
    //   вверх: вниз
    //   вниз: вверх
    //   влево: вправо
    //   вправо: влево
    // }

    const opposites = {
      [this.DIRECTIONS.UP]: this.DIRECTIONS.DOWN,
      [this.DIRECTIONS.DOWN]: this.DIRECTIONS.UP,
      [this.DIRECTIONS.LEFT]: this.DIRECTIONS.RIGHT,
      [this.DIRECTIONS.RIGHT]: this.DIRECTIONS.LEFT,
    };
    // если противоположное значение нового потенциального направления не равно текущему направлению змеи, то мы его возвращаем

    if (
      this.#CAN_TURN_THIS_TICK &&
      opposites[newPotentialDirection] !== this.CURRENT_DIRECTION
    ) {
      //проверяет, не противоположно ли новое потенциальное направление текущему направление змейки

      this.#CAN_TURN_THIS_TICK = false;

      return newPotentialDirection;

    }

    // в ином случае возвращаем текущее направление без изменений

    return this.CURRENT_DIRECTION;

    // или
    // return opposites[newPotentialDirection] !== this.CURRENT_DIRECTION ? newPotentialDirection : this.CURRENT_DIRECTION
  }

  _safeguardTurnHead (newPotentialDirection) {
    if (
      newPotentialDirection !== this.CURRENT_DIRECTION
    ) {
      return false;
    }
    return true;
  }

  _handleKeyDown(e) {
    switch (e.key) {
      case "ArrowUp":
        this.CURRENT_DIRECTION = this._safeguardOppositeDirections(
          this.DIRECTIONS.UP
        )
        this.snake.turnHead(this._safeguardTurnHead(this.DIRECTIONS.UP), this.DIRECTIONS.UP, this.DIRECTIONS);
        break;
      case "ArrowDown":
        this.CURRENT_DIRECTION = this._safeguardOppositeDirections(
          this.DIRECTIONS.DOWN
        )
        this.snake.turnHead(this._safeguardTurnHead(this.DIRECTIONS.DOWN), this.DIRECTIONS.DOWN, this.DIRECTIONS);
        break;
      case "ArrowLeft":
        this.CURRENT_DIRECTION = this._safeguardOppositeDirections(
          this.DIRECTIONS.LEFT
        )
        this.snake.turnHead(this._safeguardTurnHead(this.DIRECTIONS.LEFT), this.DIRECTIONS.LEFT, this.DIRECTIONS);
        break;
      default:
        this.CURRENT_DIRECTION = this._safeguardOppositeDirections(
          this.DIRECTIONS.RIGHT
        )
        this.snake.turnHead(this._safeguardTurnHead(this.DIRECTIONS.RIGHT), this.DIRECTIONS.RIGHT, this.DIRECTIONS);
    }
  }

  _moveSnakeWrapper() {
    this.snake.move(this.CURRENT_DIRECTION, this.DIRECTIONS);
    audioEngine.playSound('move');

    this.#CAN_TURN_THIS_TICK = true;
    const currentSnakeCoords = this.snake.getSegmentCoordsByIndex(0);
    const snakeIsOutOfBounds =
      this.playground.outOfBoundsIsTrue(currentSnakeCoords);
    
    if (snakeIsOutOfBounds) {
      this._stop();
      this.playground.editScore(true, false, false);
    }

    const snakeSelfCollides = this.snake.selfCollides()

    if (snakeSelfCollides) {
      this._stop();
      this.playground.editScore(true, false, false);
    }

    const snakeCollidesWithFood = this.playground.snakeCollidesWithFood(currentSnakeCoords);

    if(snakeCollidesWithFood) {
      audioEngine.playSound('eat');
      this.snake.grow();
      this.playground.editScore(false, false, false);
    }

    if (snakeCollidesWithFood && this.snake.snakeLengthForBoost(true)) {
      this._boostSnakeSpeed();
    }

    if (this.playground.PLAYGROUND_FREE_CLUSTERS.length === 0) {
      this._win();
      this.playground.editScore(false, false, true);
    }
  } 

  _boostSnakeSpeed () {
    this.TICK_SPEED = this.TICK_SPEED - 50;
    clearInterval(this.MOVE_TIMER);
    this.MOVE_TIMER = setInterval( () => this._moveSnakeWrapper(),
      this.TICK_SPEED)
  }

  newGame () {
    document.querySelector('#new-game-button').addEventListener('click', this.start())
  }

  start() {
    document.querySelector('.game-container__new-game-overlays').classList.remove('active');
    this.snake.reset();
    // this.playground.renderHighScore(this.playground.SCORE);
    document.addEventListener("keydown", (e) => this._handleKeyDown(e));

    this.playground.regenerateFoodImage();

    this.MOVE_TIMER = setInterval(
      () => this._moveSnakeWrapper(),
      this.START_TICK_SPEED
    );

    audioEngine.playBackgroundMusic();
  }

  _stop() {
    document.removeEventListener("keydown", (e) => this._handleKeyDown(e));
    clearInterval(this.MOVE_TIMER);
    this.MOVE_TIMER = null;
    document.querySelector('.game-container__game-overlays').classList.add('active');
    document.querySelector('.game-container__game-over').classList.add('active');

    document.querySelector('#game-container__playground').classList.add('blur');

    this.TICK_SPEED = this.START_TICK_SPEED;
    audioEngine.stopBackgroundMusic();
    // audioEngine.

    audioEngine.playSound('dead');
  }

  _win () {
    document.removeEventListener("keydown", (e) => this._handleKeyDown(e));
    clearInterval(this.MOVE_TIMER);
    this.MOVE_TIMER = null;
    document.querySelector('.game-container__game-overlays').classList.add('active');
    document.querySelector('.game-container__win').classList.add('active');
    document.querySelector('#game-container__playground').classList.add('blur');
    this.TICK_SPEED = this.START_TICK_SPEED;
  }

  _reset () {
    this.playground.editScore(false, true);
    this.CURRENT_DIRECTION = this.DIRECTIONS.RIGHT;
    document.querySelector('#game-container__playground').classList.remove('blur');

  }

  _setUpButtons() {
    document.querySelectorAll('.game-container__button').forEach(item => {item.addEventListener('click', (e) => {
      document.querySelector('.game-container__game-overlays').classList.remove('active');

      this._reset();
      this.start()
     })
    })
    // forEach здесь нужен для того, чтобы eventListener добавлялся на каждый дом, который найдет querySelectorAll
  }

}
