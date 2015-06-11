
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