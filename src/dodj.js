// Sound files
let move = new Audio("../public/move.wav");
let newWall = new Audio("../public/new_wall.wav");
let death = new Audio("../public/death.wav");


// App
let app = {};

let startApp = () => {
  // Initialize the canvas & state
  app.canvas = document.getElementById('canvas');
  app.context = canvas.getContext('2d');
  app.removeStars = false;
  app.walls = [];
  app.score = 0;
  app.gameOver = false;
  app.dialogue = '';
  setGame();

  // Listen for keyboard events
  window.addEventListener('keydown', myKeyDown);
  window.addEventListener('keyup', myKeyUp);

  // Update the game board
  app.lastTime = window.performance.now();
  window.requestAnimationFrame(frameUpdate);
}


// Set Game Function
let setGame = () => {
  spawnPlayer();
  app.stars = [];
  spawnInitialStars();
}


// Classes
class Player {
  constructor(position, size) {
    this.position = {
      x: 55,
      y: app.canvas.height / 2
    },
    this.size = {
      height: 50,
      width: 30
    },
    this.color = "#2694FE";
  }
  move() {
    if (this.moveUp) {
      move.play();
      if (this.position.y > 31) {
        this.position.y -= 5;
      }
      else {
        this.position.y = 31;
      }
    }
    else if (this.moveDown) {
      move.play();
      if (this.position.y < 569) {
        this.position.y += 5;
      }
      else {
        this.position.y = 569;
      }
    }
    else if (this.moveRight) {
      move.play();
      if (this.position.x < 752) {
        this.position.x += 5;
      }
      else {
        this.position.x = 752;
      }
    }
    else if (this.moveLeft) {
      move.play();
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
    this.color = color,
    this.speed = 1.5
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
    this.direction = direction,
    this.speed = 3.0
  }
  move() {
    if (this.direction === 'up') {
      this.position.y -= this.speed;
      if (this.position.y <= -300) {
        let idx = app.walls.indexOf(this);
        app.walls.splice(idx, 1);
      }
    }
    else if (this.direction === 'left') {
      this.position.x -= this.speed;
      if (this.position.x <= -384) {
        let idx = app.walls.indexOf(this);
        app.walls.splice(idx, 1);
      }
    }
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

const spawnPlayer = () => {
  app.player = new Player();
}

const spawnInitialStars = () => {
  let i = 0;
  while (i < 175) {
    addStar({x: Math.random(true) * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FF0000");
    i++;
  }
}

const frameUpdate = (timeStamp) => {
  $('#score').text('SCORE: ' + app.score);
  $('#dialogue').text(app.dialogue);
  if (app.gameOver === true) {
    app.player.moveLeft = false;
    app.player.moveRight = false;
    app.player.moveUp = false;
    app.player.moveDown = false;
    app.dialogue = 'GAME OVER! (SPACEBAR TO PLAY AGAIN)';
    window.requestAnimationFrame(frameUpdate);
  }
  else {
    app.score++;
    window.requestAnimationFrame(frameUpdate);
    app.lastTime = timeStamp;
    app.player.move();
    drawScene();
    app.stars.forEach(function (star) {
      star.position.x -= star.speed;
    })
    app.walls.forEach(function (wall) {
      wall.move();
      if (wall.direction === 'up') {
        if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
          if (wall.position.y - 330 <= app.player.position.y && wall.position.y + 330 >= app.player.position.y) {
            death.play();
            app.gameOver = true;
          }
        }
        if (wall.position.y - 330 <= app.player.position.y && wall.position.y + 330 >= app.player.position.y) {
          if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
            death.play();
            app.gameOver = true;
          }
        }
      }
      else if (wall.direction === 'left') {
        if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
          if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
            death.play();
            app.gameOver = true;
          }
        }
        if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
          if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
            death.play();
            app.gameOver = true;
          }
        }
      }
    })
    addStarChance();
    addWallChance();
    if (app.stars.length >= 500) {
      app.removeStars = true;
    }
    if (app.removeStars === true) {
      app.stars = app.stars.slice(app.stars.length / 2, app.stars.length);
      app.removeStars = false;
    }
  }
}

const addStarChance = () => {
  let chance = Math.random();
  if (chance >= 0.8) {
    addStar(false);
  }
}

const addWallChance = () => {
  let chance = Math.random();
  if (chance >= 0.98 && app.walls.length <= 3) {
    addWall();
  }
}

const addStar = (init) => {
  if (init === false) {
    let newStar = new Star({x: 763, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#E4FFFF");
    app.stars.push(newStar);
  }
  else {
    let newStar = new Star({x: Math.random() * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FFFFFF");
    app.stars.push(newStar);
  }
}

const addWall = () => {
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
    newWall.play();
    app.walls.push(new Wall({x: 1144.5, y: yPosition}, {height: 150, width: 768}, '#FE3527', direction));
  }
  else if (direction === 'up') {
    if (xPosition <= 40) {
      xPosition += 40;
    }
    newWall.play();
    app.walls.push(new Wall({x: xPosition, y: 900}, {height: 600, width: 192}, '#FE3527', direction));
  }
}

const drawScene = () => {
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
const myKeyDown = (e) => {
  if (app.gameOver === true) {
    switch(e.keyCode) {
      case 32:
        resetGame();
    }
  }
  else {
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
}

const myKeyUp = (e) => {
  if (app.gameOver === true) {
    // do nothing
  }
  else {
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


// Reset Game Function
const resetGame = () => {
  app.gameOver = false;
  app.dialogue = '';
  app.score = 0;
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
