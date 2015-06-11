// Define 2D drawing context
var ctx = $('#canvas')[0].getContext('2d');

ctx.lineWidth = 5;

// Draw method to draw the game board
function drawGame(grid) {
	var cells = grid.cells;
	ctx.beginPath();
	// Draw vertical lines
	for (var i = 0; i < 2; i++) {
		var x = 100 + 100*i;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, 300);
	}
	// Draw horizontal lines
	for (var i= 0; i < 2; i++) {
		var y = 100 + 100*i;
		ctx.moveTo(0, y);
		ctx.lineTo(300, y);
	}

	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.closePath();

	// Draw player positions
	for (var x = 0; x < grid.size; x++) {
		for (var y = 0; y < grid.size; y++) {
			if (cells[x][y] === 'x') {
				drawX(x, y);
			} else if (cells[x][y] === 'o') {
				drawO(x, y);
			}
		}
	}
};

function drawX(cellX, cellY) {
	var i = 0, dx, dy;
	ctx.beginPath();
	// Draw two intersecting slashes
	for (i = 0; i < 2; i++) {
		dx = (cellX * 100) + 10 + (80*i);
		dy = (cellY * 100) + 10;
		ctx.moveTo(dx, dy);
		dx = (cellX * 100) + 90 - (80*i);
		dy = (cellY * 100) + 90;
		ctx.lineTo(dx, dy);
	}
	ctx.strokeStyle = 'blue';
	ctx.stroke();
	ctx.closePath();
}

function drawO(cellX, cellY) {
	var centerX = cellX*100 + 50;
	var centerY = cellY*100 + 50;
	var radius = 40;
	var sAngle = 0; // Start angle, in radians
	var eAngle = Math.PI * 2;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, sAngle, eAngle, false);
	ctx.strokeStyle = 'red';
	ctx.stroke();
	ctx.closePath();
}

// 3x3 game grid
gameGrid = new Grid(3);
playerTurn = 0; // player 1 starts

drawGame(gameGrid);

// bind click events on the canvas
$('#canvas').click(function(e){
	var x, y;
	var winState;
	// Get the cell coordinates of the click
	x = e.offsetX / 100 | 0;
	y = e.offsetY / 100 | 0;
	var pos = { x: x, y: y};

	if (gameGrid.cellAvailable(pos)) {
		if (playerTurn === 0) {
			gameGrid.markCell(pos, 'x');
			winState = gameGrid.checkWinner('x');
			drawGame(gameGrid);
			playerTurn = 1;
		}
		// Computer Player
		if (!gameGrid.gameOver()){
			var move = getBestMove(gameGrid, 'o')
			gameGrid.markCell(move, 'o');
			winState = gameGrid.checkWinner('o');
			drawGame(gameGrid);
			playerTurn = 0;
		}

		if (!!winState) {
			var msg = $('#game-msg');
			$('#canvas').off('click');

			if (winState === 'o') {
				msg.css('color', 'red').text('RED WINS');
			} else if (winState === 'x') {
				msg.css('color', 'blue').text('BLUE WINS');
			} else if (winState === 'draw') {
				msg.css('color', '#333333').text('DRAW!');
			}
		}
	}
});
