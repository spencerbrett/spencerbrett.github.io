// Define 2D drawing context
var ctx = $('#canvas').getContext('2d');

/**
* Object-oriented programming in JavaScript
* The OOP model used in JavaScript is Prototype-based programming.
* This is the basic definition of the Grid object that will be further decorated
* in the subsequent anonymous function call
**/
function Grid() {
	// Use underscores to indicate "private" member variables
	this._cells = [];
	this._moveCount = 0;
	this.draw();
}

/**
* Anonymous function call to initialize all the game logic for Tic-Tac-Toe.
* This method of initialization allows for pseudo-privacy and information hiding.
**/
(function(Grid) {
	Grid.p = Grid.prototype;

	ctx.lineWidth = 5;

	// global choice variable for computer player move
	var choice;

	// Override draw method to draw the game board
	Grid.p.draw = function() {
		var i = 0;
		var x, y, cells;

		ctx.beginPath();

		// Draw vertical lines
		for (; i < 2; i++) {
			x = 100 + 100*i;
			ctx.moveTo(x, 0);
			ctx.lineTo(x, 300);
		}
		// Draw horizontal lines
		for (i= 0; i < 2; i++) {
			y = 100 + 100*i;
			ctx.moveTo(0, y);
			ctx.lineTo(300, y);
		}

		ctx.strokeStyle = '#000000';
		ctx.stroke();
		ctx.closePath();

		// Draw player positions
		cells = this._cells;
		for (i = 0; i < 9; i++) {
			x = i % 3;
			// Using the bitwise OR to do integer truncation
			y = i / 3 | 0;
			if (cells[i] === 'x') {
				drawX(x, y);
			} else if (cellse[i] === 'o') {
				drawO(x, y);
			}
		}
	};

	Grid.p.markCellWithX = function(x, y) {
		// Simulate 2D array logic using 3 as a row offset
		this._cells[(y * 3) + x] = 'x';
		this._moveCount++;

		if (this._checkVictory(x, y, 'x')) {
			this.currentState = 'x victory';
		} else if (this._checkDraw()) {
			this.currentState = 'draw';
		}
		this.draw();
	};

	Grid.p.markCellWithO = function(x, y) {
		this._cells[(y * 3) + x] = 'o';
		this._moveCount++;

		if (this._checkVictory(x, y, 'o')) {
			this.currentState = 'o victory';
		} else if (this._checkDraw()) {
			this.currentState = 'draw';
		}
		this.draw();
	};

	Grid.p.isMarkedCell = function(x, y) {
		return this._cells[(y * 3) + x] !== 'undefined';
	};

	Grid.p.isMarkedCellWith = function(x, y, symbol) {
		return this._cells[(y * 3) + x] === symbol;
	};

	Grid.p._checkVictory = function(x, y, symbol) {
		var i;
		// Check column
		for (i = 0; i < 3; i++) {
			if (!this.isMarkedCellWith(x, i, symbol)) break;
			if (i === 2) return true;
		}
		// Check row
		for (i = 0; i < 3; i++) {
			if (!this.isMarkedCellWith(i, y, symbol)) break;
			if (i === 2) return true;
		}
		// Check top-left -> bottom-right diagonal
		for (i = 0; i < 3; i++) {
			if (!this.isMarkedCellWith(i, i, symbol)) break;
			if (i === 2) return true;
		}
		// Check bottom-left -> top-right diagonal
		for (i = 0; i < 3; i++) {
			if (!this.isMarkedCellWith(i, (2 - i), symbol)) break;
			if (i === 2) return true;
		}
		return false;
	};

	Grid.p._checkDraw = function() {
		return this._moveCount === 9;
	};

	function drawX(cellX, cellY) {
		var i = 0;
		var dx, dy;
		ctx.beginPath();
		// Draw two intersecting slashes
		for (i = 0; i < 2; i ++) {
			dx = (cellX * 100) + 10 + (80*i);
			dy = (cellY * 100) * 10;
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
		ctx.arc(centerX, centerY, radius, sAngle, eAngle);
		ctx.strokeStyle = 'red';
		ctx.closePath();
	}

	function isMarkedCellWith(cells, x, y, symbol) {
		return cells[(y * 3) + x] === symbol;
	}

	// This function is for checking if the symbol won in a particular game state
	function checkWin(cells, symbol) {
		var i, j;
		// Check columns
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (!isMarkedCellWith(cells, i, j, symbol)) break;
				if (j === 2) return true;
			}
		}
		// Check rows
		for (i = 0; i < 3; i ++) {
			for (j = 0; j < 3; j++) {
				if (!isMarkedCellWith(cells, j, i, symbol)) break;
				if (j === 2) return true;
			}
		}
		// Check top-left -> bottom-right diagonal
		for (i = 0; i < 3; i++) {
			if (!isMarkedCellWith(cells, i, i, symbol)) break;
			if (i === 2) return true;
		}
		// Check bottom-left -> top-right diagonal
		for (i = 0; i < 3; i++) {
			if (!isMarkedCellWith(cells, i, (2 - i), symbol)) break;
			if (i === 2) return true;
		}
	}

	function checkOver(cells) {
		var i;
		for (i = 0; i < 9; i++) {
			if (cells[i] === 'undefined') return false;
		}
		return true;
	}

	function score(cells, depth) {
		// X is human player
		if (checkWin(cells, 'x')) return -(10 - depth);
		// O is computer
		else if (checkWin(cells, 'o')) return (10 - depth);
		else return 0;
	}
})(Grid);

gameGrid = new Grid();
playerTurn = 0; // player 1 starts

// bind click events on the canvas
$('#canvas').click(function(e){
	var x, y;
	// Get the cell coordinates of the click
	x = e.offsetX / 100 | 0;
	y = e.offsetY / 100 | 0;

	if (!gameGrid.isMarkedCell(x, y)) {
		if (playerTurn === 0) {
			gameGrid.markCellWithX(x, y);
			playerTurn = 1;
		} else {
			gameGrid.markCellWithO(x, y);
			playerTurn = 0;
		}

		if (typeof gameGrid.currentState !== 'undefined') {
			var msg = $('#game-msg');
			$('#canvas').off('click');

			if (gameGrid.currentState === 'o victory') {
				msg.css('color', 'red').text('RED WINS');
			} else if (gameGrid.currentState === 'x victory') {
				msg.css('color', 'blue').text('BLUE WINS');
			}
		}
	}
})