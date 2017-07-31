let app = {};

let startApp = () => {
  // Initialize the canvas
  app.canvas = document.getElementById('canvas');
  app.context = canvas.getContext('2d');
  app.speed = 2;
  app.removeStars = false;
  app.walls = [];

  // Initialize the game
  setGame();

  // Listen for keyboard events
  window.addEventListener('keydown', myKeyDown);
  window.addEventListener('keyup', myKeyUp);

  // Update the game board
  app.lastTime = window.performance.now();
  window.requestAnimationFrame(frameUpdate);
}

let setGame = () => {
  spawnPlayer();
  app.stars = [];
  spawnInitialStars();
}

class Player {
  constructor(position, size, color) {
    this.position = position,
    this.size = size,
    this.color = color
  }
  move() {
    if (this.moveUp) {
      if (this.position.y > 31) {
        this.position.y -= 5
      }
      else {
        this.position.y = 31;
      }
    }
    else if (this.moveDown) {
      if (this.position.y < 569) {
        this.position.y += 5;
      }
      else {
        this.position.y = 569;
      }
    }
    else if (this.moveRight) {
      if (this.position.x < 752) {
        this.position.x += 5;
      }
      else {
        this.position.x = 752;
      }
    }
    else if (this.moveLeft) {
      if (this.position.x > 16) {
        this.position.x -= 5;
      }
      else {
        this.position.x = 16;
      }
    }
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

class Star {
  constructor(position, size, color) {
    this.position = position,
    this.size = size,
    this.color = color;
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

class Wall {
  constructor(position, size, color, direction) {
    this.position = position,
    this.size = size,
    this.color = color,
    this.direction = direction
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

let spawnPlayer = () => {
  app.player = new Player({x: 55, y: app.canvas.height / 2}, {height: 60, width: 30}, "#9A40F4");
}

function spawnInitialStars() {
  let i = 0;
  while (i < 12) {
    addStar({x: Math.random(true) * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FF0000");
    i++;
  }
}

function frameUpdate(timeStamp) {
  window.requestAnimationFrame(frameUpdate);
  app.lastTime = timeStamp;
  app.player.move();
  drawScene();
  app.stars.forEach(function (star) {
    star.position.x -= app.speed;
  })
  app.walls.forEach(function (wall) {
    if (wall.direction === 'up') {
      wall.position.y -= app.speed;
      if (wall.position.y <= -300) {
        let idx = app.walls.indexOf(wall);
        app.walls.splice(idx, 1);
      }
      if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
        if (wall.position.y - 325 <= app.player.position.y && wall.position.y + 325 >= app.player.position.y) {
          alert('Game Over!');
          resetGame();
        }
      }
      if (wall.position.y - 325 <= app.player.position.y && wall.position.y + 325 >= app.player.position.y) {
        if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
          alert('Game Over!');
          resetGame();
        }
      }
    }
    else if (wall.direction === 'left') {
      wall.position.x -= app.speed;
      if (wall.position.x <= -384) {
        let idx = app.walls.indexOf(wall);
        app.walls.splice(idx, 1);
      }
      if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
        if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
          alert('Game Over!');
          resetGame();
        }
      }
      if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
        if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
          alert('Game Over!');
          resetGame();
        }
      }
    }
  })
  addStarChance();
  addWallChance();
  if (app.stars.length >= 200) {
    app.removeStars = true;
  }
  if (app.removeStars === true) {
    app.stars = app.stars.slice(app.stars.length / 2, app.stars.length);
    app.removeStars = false;
  }
}

let addStarChance = () => {
  let chance = Math.random();
  if (chance >= 0.8) {
    addStar(false);
  }
}

let addWallChance = () => {
  let chance = Math.random();
  if (chance >= 0.98 && app.walls.length <= 3) {
    addWall();
  }
}

function addStar(init) {
  if (init === false) {
    let newStar = new Star({x: 763, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FFFFFF");
    app.stars.push(newStar);
  }
  else {
    let newStar = new Star({x: Math.random() * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FFFFFF");
    app.stars.push(newStar);
  }
}

function addWall() {
  let direction = Math.random();
  let xPosition = Math.random() * app.canvas.width;
  let yPosition = Math.random() * app.canvas.height;
  if (direction >= 0.5) {
    direction = 'left';
  }
  else {
    direction = 'up';
  }
  if (direction === 'left') {
    if (yPosition <= 40) {
      yPosition += 40;
    }
    app.walls.push(new Wall({x: 1144.5, y: yPosition}, {height: 150, width: 768}, '#FFFFFF', direction));
  }
  else if (direction === 'up') {
    if (xPosition <= 40) {
      xPosition += 40;
    }
    app.walls.push(new Wall({x: xPosition, y: 900}, {height: 600, width: 192}, '#FFFFFF', direction));
  }
}

let drawScene = () => {
  app.context.fillStyle = '#000020';
  app.context.fillRect(0, 0, app.canvas.width, app.canvas.height);
  app.player.drawMe(app.context);
  app.stars.forEach(function (star) {
    star.drawMe(app.context);
  })
  app.walls.forEach(function (wall) {
    wall.drawMe(app.context);
  })
}


// Key Down/Up
let myKeyDown = (e) => {
  switch(e.keyCode) {
    case 38:
      upKeyDownHandler();
      break;
    case 40:
      downKeyDownHandler();
      break;
    case 39:
      rightKeyDownHandler();
      break;
    case 37:
      leftKeyDownHandler();
      break;
  }
}

function myKeyUp(e) {
  switch(e.keyCode) {
    case 38:
      upKeyUpHandler();
      break;
    case 40:
      downKeyUpHandler();
      break;
    case 39:
      rightKeyUpHandler();
      break;
    case 37:
      leftKeyUpHandler();
      break;
  }
}


// Key Handlers
const upKeyDownHandler = () => {
  app.player.moveUp = true;
}

const downKeyDownHandler = () => {
  app.player.moveDown = true;
}

const rightKeyDownHandler = () => {
  app.player.moveRight = true;
}

const leftKeyDownHandler = () => {
  app.player.moveLeft = true;
}

const upKeyUpHandler = () => {
  app.player.moveUp = false;
}

const downKeyUpHandler = () => {
  app.player.moveDown = false;
}

const rightKeyUpHandler = () => {
  app.player.moveRight = false;
}

const leftKeyUpHandler = () => {
  app.player.moveLeft = false;
}

const resetGame = () => {
  app.player.position.x = 55;
  app.player.position.y = 300;
  app.stars = [];
  spawnInitialStars();
  app.walls = [];
  app.player.moveLeft = false;
  app.player.moveRight = false;
  app.player.moveUp = false;
  app.player.moveDown = false;
}