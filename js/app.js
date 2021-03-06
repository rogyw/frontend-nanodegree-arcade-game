"use strict";
/* app.js
 * This is the application file defining CONSTANTS, Player, Enemy.
 */

//Constants
var GAME_TILE_WIDTH = 101;
var GAME_TILE_HEIGHT = 83;
var ENEMY_Y_OFFSET = 20;
var PLAYER_Y_OFFSET = 20;
var ENEMY_WIDTH = GAME_TILE_WIDTH;
var ENEMY_TOP_MARGIN = 77;
var ENEMY_HEIGHT = 65;

//Define the Game playing grid area here
var GAME_GRID_COLUMNS = 5;
var GAME_GRID_ROWS = 8;
var GAME_GRID_ROWS_WATER = 1;
var GAME_GRID_ROWS_PAVE = 5;
var GAME_GRID_ROWS_GRASS = 2;

//Change Enemy speed and quantity here
var ENEMY_SPEED_MAX = 150;
var ENEMY_SPEED_MIN = 10;
var ENEMY_QTY = 6;

//Define Player Lives
var PLAYER_START_LIVES = 5;

//Define the Canvas size
var CANVAS_WIDTH = GAME_TILE_WIDTH * GAME_GRID_COLUMNS;
var CANVAS_HEIGHT = GAME_TILE_HEIGHT * GAME_GRID_ROWS + 108;

//DEBUG enables selective debug output to Console Log
var DEBUG = false;

/**
 * @description: Base class for game objects
 */
var GameObject = function() {
  // Variables applied to each of our instances go here
    this.x = 0;
    this.y = 0;
    this.sprite = "images/star.png";  //default image
};

/**
 * @description: Draw the object on the screen, required method for game
 */
GameObject.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * Creates a new Enemy.
 * @constructor
 * @description: represents an Enemy our player must avoid
 */
var Enemy = function() {
  //Enemy is a subclass of GameObject
  GameObject.call(this);

  // Variables applied to each of our instances go here

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  this.speedMax = ENEMY_SPEED_MAX;
  this.speedMin = ENEMY_SPEED_MIN;

  // Establish the initial state of the Enemy
  this.reset();
};

//Enemy is a subclass of GameObject
Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;


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
    if (DEBUG) console.log("Enemy.checkCollision() **HIT!**");
    if (DEBUG) console.log("Enemy.checkCollision() player = (" + pLeft + "," + pTop + " - " + pRight + "," + pBottom + ")");
    if (DEBUG) console.log("Enemy.checkCollision() enemy = (" + Math.ceil(eLeft) + "," + Math.ceil(eTop) + " - " + Math.ceil(eRight) + "," + Math.ceil(eBottom) + ")");
    player.die();
  }
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
};


/**
 * Creates a new Player.
 * @constructor
 * @description: represents the player of the game
 * @param {string} type - the type of image/sprite to use for the player
 *   Valid values are: "cat-girl","horn-girl","pink-girl","princess-girl","boy"
 *   Defaults to "boy".
 */
var Player = function(type) {
  //Enemy is a subclass of GameObject
  GameObject.call(this);

  // Variables applied to each player instance go here,
  // Score display variables
  this.score = 0;
  this.lives = PLAYER_START_LIVES;
  this.message = "";

  // image/sprite internal dimensions variables
  this.sideMargin = 20;
  this.topMargin = 77;
  this.playerHeight = 68;

  // The image/sprite for our player
  switch (type) {
    case "cat-girl":
      this.sprite = 'images/char-cat-girl.png';
      break;
    case "horn-girl":
      this.sprite = 'images/char-horn-girl.png';
      break;
    case "pink-girl":
      this.sprite = 'images/char-pink-girl.png';
      break;
    case "princess-girl":
      this.sprite = 'images/char-princess-girl.png';
      break;
    case "boy":
    default:
      this.sprite = 'images/char-boy.png';
      break;
  }

  //The initial position
  this.reset();
};

//Player is a subclass of GameObject
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;


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
};


/**
 * @description: players initial position for life start
 */
Player.prototype.reset = function() {
  //The row of grass
  this.row = GAME_GRID_ROWS - 1;
  this.y = this.row * GAME_TILE_HEIGHT;

  //The column of grass
  this.column = Math.floor(GAME_GRID_COLUMNS / 2);
  this.x = this.column * GAME_TILE_WIDTH;

  if ((this.score > 0) && ((this.score % 10) === 0)) {
    this.message = "   Well done!";
  } else if (this.message == "   Well done!") {
    this.message = "";
  }
};


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
};


/**
 * @description: output the game status and messages
 */
Player.prototype.displayScore = function() {
  ctx.fillStyle = "gold";
  ctx.font = "bold 20pt sans-serif";
  ctx.textBaseline = "top";
  ctx.clearRect(0, 10, CANVAS_WIDTH, 25);
  ctx.fillText("Score: " + this.score + "     Lives: " + this.lives + "   " + this.message, 10, 10);
};


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
};


/**
 * @description: Handle the user input for game play
 * @param {string} direction - the player movement direction
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
      if (this.row < (GAME_GRID_ROWS - 1)) {
        this.row++;
      }
      break;
    default:
      break;
  }
};


/**
 * @description: Calculates movement direction based on click
 * @param {string} clickX - the Canvas click x coordinate
 * @param {string} clickY - the Canvas click y coordinate
 * @returns {string} with values including: "left", "right", "up", "down", "".
 */
Player.prototype.checkClick = function(clickX,clickY) {
  var direction = "";

  if (DEBUG) console.log("Player.checkClick() (X,Y) = (" + clickX + "," + clickY + ")");

  //Calculate player block area
  var pLeft = this.x;
  var pRight = this.x + GAME_TILE_WIDTH;
  var pTop = this.y + 70;
  var pBottom = pTop + GAME_TILE_HEIGHT;

  if (DEBUG) console.log("Player.checkClick()  player (L,T - R,B) = ("+ pLeft + "," + pTop + " - " + pRight + "," + pBottom + ")");

  //Test for *UP*
  if ((clickY < pTop) && (clickY > pTop - GAME_TILE_HEIGHT) && (clickX > pLeft) && (clickX < pRight)){
    direction = 'up';
  }

  //Test for *DOWN*
  if ((clickY > pBottom) && (clickY < pBottom + GAME_TILE_HEIGHT) && (clickX > pLeft) && (clickX < pRight)){
    direction =  'down';
  }

  //Test for *LEFT*
  if ((clickX < pLeft) && (clickX > pLeft - GAME_TILE_WIDTH) && (clickY > pTop) && (clickY < pBottom)){
    direction = 'left';
  }

  //Test for *RIGHT*
  if ((clickX > pRight) && (clickX < pRight + GAME_TILE_WIDTH) && (clickY > pTop) && (clickY < pBottom)){
    direction =  'right';
  }

  //Default
  if (DEBUG) console.log("Player.checkClick() direction =" + direction);
  return direction;
};
