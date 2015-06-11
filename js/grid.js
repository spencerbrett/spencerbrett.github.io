
/**
* Object-oriented programming in JavaScript
* The OOP model used in JavaScript is Prototype-based programming.
* This is the basic definition of the Grid object that will be further decorated
* in the subsequent extensions to the object prototype.
* A square grid with width/height defined by a single size parameter.
* Additionally, copy functionality for use in maintaining state.
**/ 
function Grid(size, previousState) {
	this.size = size;
	this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid with the specified size
Grid.prototype.empty = function () {
	var cells = [];
	// Define 2D array as an Array of Arrays
	for (var x = 0; x < this.size; x++) {
		// Initialize each index as an empty Array and assign reference to row.
		var row = cells[x] = [];
		for (var y = 0; y < this.size; y++) {
			row.push(null);
		}
	}
	return cells;
};

// Copy grid from previous state
Grid.prototype.fromState = function(state) {
	var cells = [];

	for (var x = 0; x < this.size; x++) {
		var row = cells[x] = [];
		for (var y = 0; y < this.size; y++) {
			var symbol = state[x][y]; // simple character representing X or O.. or null
			row.push(symbol)
		}
	}
	return cells;
};

// List of empty cells in the grid.
Grid.prototype.availableCells = function() {
	var cells = [];

	// The scoping on this is a little confusing to me.
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if (!this.cells[x][y]) {
				cells.push({x: x, y: y}); // add non-null cells to return list
			}
		}
	}

	return cells
};

// Check if there are any cells available 
Grid.prototype.cellsAvailable = function() {
	// Lazy casting of integer to boolean (Also supports null)
	return !!this.availableCells().length;
};

// Check if the specified cell is empty
Grid.prototype.cellAvailable = function(pos) {
	return !this.cellOccupied(pos);
};

Grid.prototype.cellOccupied = function(pos) {
	return !!this.cells[pos.x][pos.y];
};

Grid.prototype.markCell = function(pos, symbol) {
	this.cells[pos.x][pos.y] = symbol;
};


Grid.prototype.checkWinner = function(symbol) {
	var cells = this.cells;
	var size = this.size;
	var max = size-1;
	// Check columns
	for (var x = 0; x < size; x++) {
		for (var y = 0; y < size; y++) {
			// cut column check if opposite symbol
			if (cells[x][y] !== symbol) break;
			// reached end of column without short circuit means full column of symbol
			if (y == max) return symbol;
		}
	}
	// Check rows
	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {
			// cut column check if opposite symbol
			if (cells[x][y] !== symbol) break;
			// reached end of column without short circuit means full column of symbol
			if (x == max) return symbol;
		}
	}
	// Check top-left to bottom-right diagonal
	for (var i = 0; i < size; i++) {
		if (cells[i][i] !== symbol) break;
		if (i == max) return symbol;
	}
	// Check bottom-left to top-right diagonal
	for (var i = 0; i < size; i++) {
		if (cells[(max)-i][i] !== symbol) break;
		if (i == max) return symbol;
	}
	// Check draw. Because there was no victory. Full game board means draw.
	if (!this.cellsAvailable()){
		return 'draw';
	}
	return null;
};

// Check if either side won
Grid.prototype.gameOver = function() {
	var cells = this.cells;
	var size = this.size;
	var max = size-1;
	var contender;
	// Check columns
	for (var x = 0; x < size; x++) {
		contender = cells[x][0];
		for (var y = 0; y < size; y++) {
			// cut column check if opposite symbol
			if (!contender || cells[x][y] !== contender) break;
			// reached end of column without short circuit means full column of symbol
			if (y == max) return true;
		}
	}
	// Check rows
	for (var y = 0; y < size; y++) {
		contender = cells[0][y];
		for (var x = 0; x < size; x++) {
			// cut column check if opposite symbol
			if (!contender || cells[x][y] !== contender) break;
			// reached end of column without short circuit means full column of symbol
			if (x == max) return true;
		}
	}
	contender = cells[0][0];
	// Check top-left to bottom-right diagonal
	for (var i = 0; i < size; i++) {
		if (!contender || cells[i][i] !== contender) break;
		if (i == max) return true;
	}
	contender = cells[max][0];
	// Check bottom-left to top-right diagonal
	for (var i = 0; i < size; i++) {
		if (!contender || cells[(max)-i][i] !== contender) break;
		if (i == max) return true;
	}
	// Check draw. Because there was no victory. Full game board means draw.
	if (!this.cellsAvailable()){
		return true;
	}
	return false;
};

/**
* Function for serializing the grid state.
* May be redundant with copy constructor.
**/
Grid.prototype.serialize = function () {
	var cellState = [];
	for (var x = 0; x < this.size; x++) {
		var row = cellState[x] = [];
		for (var y = 0; y < this.size; y++) {
			row.push(this.cells[x][y]);
		}
	}

	return {
		size: this.size,
		cells: cellState
	};
};
