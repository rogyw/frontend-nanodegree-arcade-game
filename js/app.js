// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  //Move the Enemy position
  this.x = this.x + (this.speed * (4 - this.row) * dt);
  if (this.x > (101 * 5)) this.reset();

  //Check for Collision
  this.checkCollision();
};

Enemy.prototype.checkCollision = function() {
  var pLeft = player.x + player.sideMargin;
  var pRight = player.x + 101 - player.sideMargin;
  var pTop = player.y + player.topMargin;
  var pBottom = pTop + player.playerHeight;

  var eLeft = this.x;
  var eRight = this.x + 101;
  var eTop = this.y + 77;
  var eBottom = eTop + 65;

  if ((eRight > pLeft) && (eLeft < pRight) && (eBottom > pTop) && (eTop < pBottom)) {
    console.log("**HIT!**");
    console.log("player = (" + pLeft + "," + pTop + " - " + pRight + "," + pBottom + ")");
    console.log("enemy = (" + Math.ceil(eLeft) + "," + Math.ceil(eTop) + " - " + Math.ceil(eRight) + "," + Math.ceil(eBottom) + ")");
    player.die();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
  //The movement speed of the enemy - range 1-10
  this.speed = Math.floor((Math.random() * 150) + 10);

  //The row of paving the enemy is allocated to - range 1-3
  this.row = Math.floor((Math.random() * 3) + 1);
  this.y = (this.row * 83) - 25;

  //The column of paving the enemy is allocated to - range 1-5
  this.column = Math.floor((Math.random() * 5) + 1);
  this.x = this.column * -101;
}


// Player class
var Player = function(type) {
  // Variables applied to each player instance go here,
  this.score = 0;
  this.lives = 5;
  this.message = "";

  this.sideMargin = 15;
  this.topMargin = 50;
  this.playerHeight = 76;

  // The image/sprite for our player
  switch (type) {
    case "cat-girl":
      this.sprite = 'images/char-cat-girl.png';
      break
    case "horn-girl":
      this.sprite = 'images/char-horn-girl.png';
      break
    case "pink-girl":
      this.sprite = 'images/char-pink-girl.png';
      break
    case "princess-girl":
      this.sprite = 'images/char-princess-girl.png';
      break
    case "boy":
    default:
      this.sprite = 'images/char-boy.png';
      break
  }

  //The initial position
  this.reset();

}

Player.prototype.die = function() {
  this.lives--;

  if (this.lives == 1) {
    this.message = " *Last life!*";
  } else if (this.lives <= 0) {
    this.message = " *GAME OVER!*";
  }

  this.reset();
}

Player.prototype.reset = function() {
  //The row of grass
  this.row = 5;
  this.y = this.row * 83;

  //The column of grass
  this.column = 2;
  this.x = this.column * 101;

  if (this.score > 20) {
    this.message = "   Well done!"
  }
}

Player.prototype.gameOver = function() {
  if (this.lives <= 0) {
    return true;
  } else {
    return false;
  }
}

Player.prototype.displayScore = function() {
  ctx.fillStyle = "black";
  ctx.font = "bold 20pt sans-serif";
  ctx.textBaseline = "top";
  ctx.clearRect(0, 10, 505, 25)
  ctx.fillText("Score: " + this.score + "     Lives: " + this.lives + "   " + this.message, 10, 10);
}

Player.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.column * 101;
  this.y = this.row * 83;
  this.displayScore();
}

Player.prototype.render = Enemy.prototype.render;

Player.prototype.handleInput = function(direction) {

  //Stop moving after game over
  if (this.gameOver()) return;

  switch (direction) {
    case 'left':
      if (this.column > 0) {
        this.column--;
      }
      break;
    case 'up':
      if (this.row > 1) {
        this.row--;
      } else if (this.row <= 1) {
        this.score++;
        this.reset();
      }

      break;
    case 'right':
      if (this.column < 4) {
        this.column++;
      }
      break;
    case 'down':
      if (this.row < 5) {
        this.row++;
      }
      break;
    default:
      break;
  };

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
enemyCount = 5;
for (var myEnemies = 0;
  (myEnemies < enemyCount); myEnemies++) {
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
var player = new Player("princess-girl");


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
