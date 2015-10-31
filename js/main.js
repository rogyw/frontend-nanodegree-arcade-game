

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

/**
 * This listens for key presses and sends the keys
 * to Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

//Get the Canvas
var canvasArray = document.getElementsByTagName("canvas");
var myCanvas = canvasArray[0];

/**
 * This listens for mouse clicks, calls player.checkClick
 * to check if its a valid move location and then sends move to
 * Player.handleInput() method.
 */
myCanvas.addEventListener('click', function(e) {
  var move;
  move = player.checkClick(e.clientX, e.clientY);
  player.handleInput(move);
});

