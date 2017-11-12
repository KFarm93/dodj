// Sound files
let move = new Audio("../public/move.wav");
let newWall = new Audio("../public/new_wall.wav");
let death = new Audio("../public/death.wav");

// Classes
class Player {
  constructor(game) {
    this.position = {
      x: 55,
      y: game.canvas.height / 2
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

// Game Class
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.removeStars = false;
    this.walls = [];
    this.stars = [];
    this.gameOver = false;
    this.dialogue = '';
    this.score = 0;
    this.player = new Player(this);
    this.init = true;
  }
  spawnInitialStars() {
    let i = 0;
    while (i < 175) {
      this.addStar({x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height}, {height: 4, width: 4}, "#FF0000");
      i++;
    }
  }
  addStar() {
    if (this.init === true) {
      let newStar = new Star({x: 763, y: Math.random() * 600}, {height: 4, width: 4}, "#FFFFFF");
      this.stars.push(newStar);
      this.init = false;
    }
    else {
      let newStar = new Star({x: Math.random() * 780, y: Math.random() * 600}, {height: 4, width: 4}, "#FFFFFF");
      this.stars.push(newStar);
    }
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
  constructor(position, size, direction, speed) {
    this.position = position,
    this.size = size,
    this.color = '#FF4500',
    this.direction = direction,
    this.speed = speed;
  }
  move() {
    if (this.direction === 'up') {
      this.position.y -= this.speed;
      if (this.position.y <= -300) {
        let idx = game.walls.indexOf(this);
        game.walls.splice(idx, 1);
      }
    }
    else if (this.direction === 'left') {
      this.position.x -= this.speed;
      if (this.position.x <= -384) {
        let idx = game.walls.indexOf(this);
        game.walls.splice(idx, 1);
      }
    }
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

let canvas = document.getElementById('canvas');
let game = new Game(canvas);


let startGame = () => {
  game.spawnInitialStars();

  // Listen for keyboard events
  window.addEventListener('keydown', myKeyDown);
  window.addEventListener('keyup', myKeyUp);

  // Update the game board
  game.lastTime = window.performance.now();
  window.requestAnimationFrame(frameUpdate);
}


const frameUpdate = (timeStamp) => {
  $('#score').text('SCORE: ' + game.score);
  $('#dialogue').text(game.dialogue);
  if (game.gameOver === true) {
    game.player.moveLeft = false;
    game.player.moveRight = false;
    game.player.moveUp = false;
    game.player.moveDown = false;
    game.dialogue = 'GAME OVER! (SPACEBAR TO PLAY AGAIN)';
    window.requestAnimationFrame(frameUpdate);
  }
  else {
    game.score++;
    window.requestAnimationFrame(frameUpdate);
    game.lastTime = timeStamp;
    game.player.move();
    drawScene();
    game.stars.forEach(function (star) {
      star.position.x -= star.speed;
    })
    game.walls.forEach(function (wall) {
      wall.move();
      if (wall.direction === 'up') {
        if (wall.position.x - 109 <= game.player.position.x && wall.position.x + 109 >= game.player.position.x) {
          if (wall.position.y - 330 <= game.player.position.y && wall.position.y + 330 >= game.player.position.y) {
            death.play();
            game.gameOver = true;
          }
        }
        if (wall.position.y - 330 <= game.player.position.y && wall.position.y + 330 >= game.player.position.y) {
          if (wall.position.x - 109 <= game.player.position.x && wall.position.x + 109 >= game.player.position.x) {
            death.play();
            game.gameOver = true;
          }
        }
      }
      else if (wall.direction === 'left') {
        if (wall.position.x - 394 <= game.player.position.x && wall.position.x + 394 >= game.player.position.x) {
          if (wall.position.y - 98 <= game.player.position.y && wall.position.y + 98 >= game.player.position.y) {
            death.play();
            game.gameOver = true;
          }
        }
        if (wall.position.y - 98 <= game.player.position.y && wall.position.y + 98 >= game.player.position.y) {
          if (wall.position.x - 394 <= game.player.position.x && wall.position.x + 394 >= game.player.position.x) {
            death.play();
            game.gameOver = true;
          }
        }
      }
    })
    addStarChance();
    addWallChance();
    if (game.stars.length >= 600) {
      game.removeStars = true;
    }
    if (game.removeStars === true) {
      game.stars = game.stars.slice(game.stars.length / 2, game.stars.length);
      game.removeStars = false;
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
  if (game.walls.length <= 2) {
    addWall();
  }
}

const addStar = (init) => {
  if (init === false) {
    let newStar = new Star({x: 763, y: Math.random() * 600}, {height: 4, width: 4}, "#FFFFFF");
    game.stars.push(newStar);
  }
  else {
    let newStar = new Star({x: Math.random() * 780, y: Math.random() * 600}, {height: 4, width: 4}, "#FFFFFF");
    game.stars.push(newStar);
  }
}

const getRandomCoords = (direction) => {
  let min;
  let max;
  if (direction == 'left') {
    min = Math.ceil(75);
    max = Math.floor(525);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  else if (direction == 'up') {
    min = Math.ceil(97.5);
    max = Math.floor(682.5);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

const addWall = () => {
  let directionChance = Math.random();
  let speedChance = Math.random();
  let direction;
  let speed;
  if (directionChance >= .5) {
    direction = 'left';
  }
  else {
    direction = 'up';
  }
  if (speedChance >= .75) {
    // very fast wall
    speed = 5.0;
  }
  else if (speedChance >= .50) {
    // fast wall
    speed = 4.0;
  }
  else if (speedChance >= .25) {
    //slow wall
    speed = 3.0;
  }
  else {
    // very slow wall
    speed = 2.0;
  }
  if (direction == 'left') {
    newWall.play();
    game.walls.push(new Wall({x: 1144.5, y: getRandomCoords('left')}, {height: 150, width: 780}, 'left', speed));
  }
  else {
    newWall.play();
    game.walls.push(new Wall({x: getRandomCoords('up'), y: 900}, {height: 600, width: 195}, 'up', speed));
  }
}

const drawScene = () => {
  game.context.fillStyle = '#000020';
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
  game.player.drawMe(game.context);
  game.stars.forEach(function (star) {
    star.drawMe(game.context);
  })
  game.walls.forEach(function (wall) {
    wall.drawMe(game.context);
  })
}


// Key Down/Up
const myKeyDown = (e) => {
  if (game.gameOver === true) {
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
  if (game.gameOver === true) {
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
  game.player.moveUp = true;
}

const downKeyDownHandler = () => {
  game.player.moveDown = true;
}

const rightKeyDownHandler = () => {
  game.player.moveRight = true;
}

const leftKeyDownHandler = () => {
  game.player.moveLeft = true;
}

const upKeyUpHandler = () => {
  game.player.moveUp = false;
}

const downKeyUpHandler = () => {
  game.player.moveDown = false;
}

const rightKeyUpHandler = () => {
  game.player.moveRight = false;
}

const leftKeyUpHandler = () => {
  game.player.moveLeft = false;
}


// Reset Game Function
const resetGame = () => {
  game.gameOver = false;
  game.dialogue = '';
  game.score = 0;
  game.player.position.x = 55;
  game.player.position.y = 300;
  game.stars = [];
  game.spawnInitialStars();
  game.walls = [];
  game.player.moveLeft = false;
  game.player.moveRight = false;
  game.player.moveUp = false;
  game.player.moveDown = false;
}
