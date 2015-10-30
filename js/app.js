//Constants
var GAME_TILE_WIDTH = 101;
var GAME_TILE_HEIGHT = 83;
var GAME_GRID_COLUMNS = 5;
var GAME_GRID_ROWS = 6;
var GAME_GRID_ROWS_WATER = 1;
var GAME_GRID_ROWS_PAVE = 3;
var GAME_GRID_ROWS_GRASS = 2;
var ENEMY_SPEED_MAX = 150;
var ENEMY_SPEED_MIN = 10;
var ENEMY_Y_OFFSET = 20;
var PLAYER_Y_OFFSET = 20;
var ENEMY_WIDTH = GAME_TILE_WIDTH;
var ENEMY_TOP_MARGIN = 77;
var ENEMY_HEIGHT = 65;
var ENEMY_QTY = 6;


/**
 * Creates a new Enemy.
 * @constructor
 * @description: represents an Enemy our player must avoid
 */
var Enemy = function() {
  // Variables applied to each of our instances go here

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  this.speedMax = ENEMY_SPEED_MAX;
  this.speedMin = ENEMY_SPEED_MIN;

  // Establish the initial state of the Enemy
  this.reset();
};


/**
 * @description: Update the enemy's position, required method for game
 * @param {number} dt - a time delta between ticks. You should multiply any movement
 *   by the dt parameter which will ensure the game runs at the same speed for
 *   all computers.
 */
Enemy.prototype.update = function(dt) {
  //The max possible speed of an enemy increases for each row closer to water
  var rowSpeedMultiplier = (GAME_GRID_ROWS_WATER + GAME_GRID_ROWS_PAVE) - this.row;

  //Move the Enemy position
  this.x = this.x + (this.speed * rowSpeedMultiplier * dt);

  //Check if Enemy has left the Grid
  if (this.x > (GAME_TILE_WIDTH * GAME_GRID_COLUMNS)) this.reset();

  //Check for Collision with Player
  this.checkCollision();
};


/**
 * @description: Checks for colision between this enemy and player
 */
Enemy.prototype.checkCollision = function() {
  //Calculate player block area
  var pLeft = player.x + player.sideMargin;
  var pRight = player.x + GAME_TILE_WIDTH - player.sideMargin;
  var pTop = player.y + player.topMargin;
  var pBottom = pTop + player.playerHeight;

  //Calculate enemy block area
  var eLeft = this.x;
  var eRight = this.x + ENEMY_WIDTH;
  var eTop = this.y + ENEMY_TOP_MARGIN;
  var eBottom = eTop + ENEMY_HEIGHT;

  //Check for overlap of enemy and player
  if ((eRight > pLeft) && (eLeft < pRight) && (eBottom > pTop) && (eTop < pBottom)) {
    //console.log("**HIT!**");
    //console.log("player = (" + pLeft + "," + pTop + " - " + pRight + "," + pBottom + ")");
    //console.log("enemy = (" + Math.ceil(eLeft) + "," + Math.ceil(eTop) + " - " + Math.ceil(eRight) + "," + Math.ceil(eBottom) + ")");
    player.die();
  }
};


/**
 * @description: Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @description:  Establish or reset the initial state of the Enemy
 */
Enemy.prototype.reset = function() {
  //The movement speed of the enemy
  this.speed = Math.floor((Math.random() * this.speedMax) + this.speedMin);

  //The row of paving the enemy is allocated to - range 1-GAME_GRID_ROWS_PAVE
  this.row = Math.floor((Math.random() * GAME_GRID_ROWS_PAVE) + 1);
  this.y = (this.row * GAME_TILE_HEIGHT) - ENEMY_Y_OFFSET;

  //The column of paving the enemy is allocated to - range 1-GAME_GRID_COLUMNS
  this.column = Math.floor((Math.random() * GAME_GRID_COLUMNS) + 1);
  this.x = this.column * GAME_TILE_WIDTH * -1;
}


/**
 * Creates a new Player.
 * @constructor
 * @description: represents the player of the game
 * @param {string} type - the type of image/sprite to use for the player
 *   Valid values are: "cat-girl","horn-girl","pink-girl","princess-girl","boy"
 *   Defaults to "boy".
 */
var Player = function(type) {
  // Variables applied to each player instance go here,
  // Score display variables
  this.score = 0;
  this.lives = 5;
  this.message = "";

  // image/sprite internal dimensions variables
  this.sideMargin = 20;
  this.topMargin = 77;
  this.playerHeight = 68;

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


/**
 * @description: action player life lost
 */
Player.prototype.die = function() {
  this.lives--;

  if (this.lives == 1) {
    this.message = " *Last life!*";
  } else if (this.lives <= 0) {
    this.message = " *GAME OVER!*";
  }

  this.reset();
}


/**
 * @description: players initial position for life start
 */
Player.prototype.reset = function() {
  //The row of grass
  this.row = 5;
  this.y = this.row * GAME_TILE_HEIGHT;

  //The column of grass
  this.column = 2;
  this.x = this.column * GAME_TILE_WIDTH;

  if (this.score > 20) {
    this.message = "   Well done!"
  }
}


/**
 * @description: check if game is finished
 * @returns true  - game is finished, false - player has life remaining
 */
Player.prototype.gameOver = function() {
  if (this.lives <= 0) {
    return true;
  } else {
    return false;
  }
}


/**
 * @description: output the game status and messages
 */
Player.prototype.displayScore = function() {
  ctx.fillStyle = "black";
  ctx.font = "bold 20pt sans-serif";
  ctx.textBaseline = "top";
  ctx.clearRect(0, 10, 505, 25)
  ctx.fillText("Score: " + this.score + "     Lives: " + this.lives + "   " + this.message, 10, 10);
}


/**
 * @description: Update the player's position, required method for game
 * @param {number} dt - a time delta between ticks. Any incremental movement should
 *   be multiplied by the dt parameter which will ensure the game runs at the same speed for
 *   all computers.
 */
Player.prototype.update = function(dt) {
  this.x = this.column * GAME_TILE_WIDTH;
  this.y = (this.row * GAME_TILE_HEIGHT) - PLAYER_Y_OFFSET;
  this.displayScore();
}


/**
 * @description: Draw the player on the screen, required method for game
 */
Player.prototype.render = Enemy.prototype.render;


/**
 * @description: Handle the user input for game play
 * param {string} direction - the player movement direction
 *   valid values include: "left", "right", "up", "down".
 */
Player.prototype.handleInput = function(direction) {

  //Stop moving after game over
  if (this.gameOver()) return;

  switch (direction) {
    case 'left':
      if (this.column > 0) {
        this.column--;
      }
      break;
    case 'right':
      if (this.column < 4) {
        this.column++;
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
var enemyCount = ENEMY_QTY;
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
