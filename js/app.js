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
    this.x = this.x + (this.speed * (4 - this.row) * dt);
    if (this.x > (101 * 5)) this.reset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
      //The movement speed of the enemy - range 1-10
    this.speed = Math.floor((Math.random() * 150) + 10);

    //The row of paving the enemy is allocated to - range 1-3
    this.row =  Math.floor((Math.random() * 3) + 1);
    this.y = (this.row * 83) - 25;

    //The column of paving the enemy is allocated to - range 1-5
    this.column =  Math.floor((Math.random() * 5) + 1);
    this.x = this.column * -101;
  }


// Player class
var Player = function(type) {
  // Variables applied to each player instance go here,

  // The image/sprite for our player
  switch(type){
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

Player.prototype.reset = function() {
      //The movement speed of the player
    this.speed = 200;

    //The row of grass
    this.row = 5;
    this.y = this.row * 83;

    //The column of grass
    this.column =  2;
    this.x = this.column * 101;
  }


Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.column * 101;
    this.y = this.row * 83 - 25;
}

Player.prototype.render = Enemy.prototype.render;

Player.prototype.handleInput = function(direction) {

  switch(direction) {
    case 'left':
      if(this.column > 0) {
        this.column--;
      }
      break;
    case 'up':
      if(this.row > 0) {
        this.row--;
      }
      break;
    case 'right':
      if(this.column < 4) {
        this.column++;
      }
      break;
    case 'down':
      if(this.row < 5) {
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
for(var myEnemies = 0; (myEnemies < enemyCount); myEnemies++){
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
