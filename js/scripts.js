let snake = null;
let engine = null;
let playground = null;
let audioEngine = null;

function init() {
  playground = new Playground();

  snake = new Snake(
    playground.getID(),
    playground.getClusterSize(),
    playground.getCleanCenterCoords()
  );

  audioEngine = new AudioEngine();
  engine = new Engine(snake, playground);
  
  document.querySelector('.game-container__new-game-overlays').classList.add('active');
}

init();