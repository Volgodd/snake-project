const LOGGING = true;
// const SECOND = 300;

let snake = null;
let engine = null;
let playground = null;

function log (message) {
  if (LOGGING) {
    // console.log(message)
  }
}

function init () {
  playground = new Playground();
  snake = new Snake(playground.getID(), playground.getClusterSize(), playground.getCleanCenterCoords());
  engine = new Engine(snake, playground);
  
  engine.start();
}

init();