const widthSegs = 4;
const heightSegs = 5;

let snakeCoords = [{x: 1, y: 2}];
let freeClusters = [{x: 0, y: 0}, {x: 0, y: 0}];

function generateFreeClusters() {
  freeClusters = [];

  for(let y = 0; y < heightSegs; y++) {
    for(let x = 0; x < widthSegs; x++) {

      for (let i = 0; i < snakeCoords.length; i++) {
        console.log(`X: ${x} | Y: ${y}`);
        if (snakeCoords[i].x !== x || snakeCoords[i].y !== y ) {
          /// push shit here
          freeClusters.push({x, y})
        }
      }

    }
  }
}

// generateFreeClusters()
// console.log(freeClusters)
//freeClusters[Math.round(Math.random()*freeClusters.length)]




// if (snakeCoords[i].x !== x) {
//   if (snakeCoords[i].y !== y)
//   this.PLAYFIELD_COORDS.push({x, y})
// } else if (snakeCoords[i].x === x) {
//     if (snakeCoords[i].y === y) {

//     }
// }





freeClustersScope () {
  console.log("called")
  this.PLAYFIELD_COORDS = [];
  let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;

  for(let y = 0; y < this.HEIGHT_CLUSTERS * this.CLUSTER_SIZE; y += 20) {
    // console.log('Y: ', y)
    for(let x = 0; x < this.WIDTH_CLUSTERS * this.CLUSTER_SIZE; x += 20) {
      // console.log('X: ', x)
      //x: 0; y: 0
      for (let i = 0; i < snakeCoords.length ; i++) {
        // console.log(`X: ${x} | Y: ${y}`);
        console.log("push made")


        
        if ((snakeCoords[i].x !== x || snakeCoords[i].y !== y) && (snakeCoords[i].y !== y || snakeCoords[i].x !== x )) {
          console.log(`Comapring new X: ${x} with Snake's X: ${snakeCoords[i].x}`)
          // if (snakeCoords[i].y !== y) {
          // console.log(`Comapring new Y: ${y} with Snake's Y: ${snakeCoords[i].y}`)
          this.PLAYFIELD_COORDS.push({x, y})
          // } 
        }
          
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


console.log(this.PLAYFIELD_COORDS)
}



// рабочий код
freeClustersScopeVar2() {
  this.generateAllPlayfieldClusters();

  this.PLAYFIELD_COORDS = [];

  let snakeCoords = snake.SNAKE_SEGMENTS_COORDS;
  let allClusters = this.ALL_PLAYFIELD_CLUSTERS;

  for (let i = 0; i < snakeCoords.length; i++) {
    for (let index = 0; index < this.ALL_PLAYFIELD_CLUSTERS.length; index++) {
      if (this.compareCoords(snakeCoords[i].x, snakeCoords[i].y, allClusters[index].x, allClusters[index].y) &&
      this.findClusters(allClusters, index)
       ) {

    

  
          // this.PLAYFIELD_COORDS.push({
          //   x: allClusters[index].x,
          //   y: allClusters[index].y,
          //   });
       
      } else {
        console.log('coords snake === coords playground, ');
        this.PLAYFIELD_COORDS.push({
          x: allClusters[index].x,
          y: allClusters[index].y,
          });
        }
      
  

    }

  }

 
  console.log(this.PLAYFIELD_COORDS);

  // code is working. Problem is that coords duplicated: arr contains as much collection of pushed coords, as snake length
}



const a = 0;

let CAN_ADD_COORDS = [];

findClusters(clusters, index) {

  if (clusters.includes(clusters.find((el) => el.x === clusters[index].x && el.y === clusters[index].y) )) {

    return (CAN_ADD_COORDS = false);

  } else return (CAN_ADD_COORDS = true);

  // allClusters.includes(allClusters.find(el => el.x === allClusters[index].x && el.y === allClusters[index].y ))
}
