function getBestMove(grid, player) {
	var moves = grid.availableCells();
	var bestMove = moves ? moves[0] : null;
	var bestScore = Number.MIN_VALUE;
	for (var i = 0; i < moves.length; i++) {
		var newState = new Grid(grid.size, grid.cells);
		newState.markCell(moves[i], player);
		var score = minimax(newState, 0, player, opponent(player));
		if (score > bestScore) {
			bestMove = moves[i];
			bestScore = score;
		}
	}
	return bestMove;
}

/**
* Scoring function to enumerate game states.
* Depth is used as a heuristic to favor victories with fewer moves.
**/
function score(grid, depth, maxPlayer) {
	// winStatus will either be the computer player, draw, or null
	var playerWin = grid.checkWinner(maxPlayer) === maxPlayer;
	var opponentWin = grid.checkWinner(opponent(maxPlayer)) === opponent(maxPlayer);
	if (playerWin) {
		return (10 - depth);
	} else if (opponentWin) {
		return (depth - 10);
	} else {
		return 0;
	}

}

function opponent(player) {
	if (!player) {
		return null;
	}
	return player === 'x' ?  'o' : 'x';
}


/**
* Minimax algorithm for determining optimal move set
**/
function minimax(grid, depth, maxPlayer, player) {
	// terminating case
	if (grid.gameOver()) {
		return score(grid, depth, maxPlayer);
	}
	var moves = grid.availableCells();
	// Choose best score for maximizing player
	if (maxPlayer === player) {
		var bestVal = Number.MIN_VALUE;
		for (var i = 0; i < moves.length; i++) {
			// In order to maintain state without side-effects while recursing through
			// possible games, we need a deep copy of the game state. This is done 
			// using a copy constructor of sorts. Each move tree requires its own grid.
			// This is why these algorithms are much easier to implement in funcitonal programming
			// languages with immutable data structures, such as OCaml or Haskell.
			var newState = new Grid(grid.size, grid.cells);
			newState.markCell(moves[i], player);
			// Recurse using new game state with chosen move. Increment depth. Switch players.
			var val = minimax(newState, depth+1, maxPlayer, opponent(player));
			bestVal = Math.max(bestVal, val);
		}
		return bestVal;
	} 
	// Choose worst score for opponent
	else {
		var bestVal = Number.MAX_VALUE;
		for (var i = 0; i < moves.length; i++) {
			var newState = new Grid(grid.size, grid.cells);
			newState.markCell(moves[i], player);
			var val = minimax(newState, depth+1, maxPlayer, opponent(player));
			bestVal = Math.min(bestVal, val);
		}
		return bestVal;
	}
}