import { createAI } from "./ai";

export function initialState() {
    return { squares: Array(9).fill(null), xIsNext: true }
}

export function reducer(state, action) {
    switch (action.type) {
        case 'move':
            return handlePlayerMove(state, action);
        case 'clear':
            return initialState();
        default:
            throw new Error();
    }
}

function handlePlayerMove(state, action) {
    const computerPlayer = createAI({ isGameOver, getScore, makeMove, getAvailableMoves });
    const newStateAfterPlayerMove = makeMove(state, action.payload);
    const computerMove = computerPlayer.getMove(newStateAfterPlayerMove);
    return computerMove ? makeMove(newStateAfterPlayerMove, computerMove) : newStateAfterPlayerMove;
}

export function makeMove(state, move) {
    const { player, position } = move;
    const squares = [...state.squares];
    squares[position] = player;
    const xIsNext = player !== 'X';
    return { squares, xIsNext };
}

export function getAvailableMoves(state) {
    const { squares, xIsNext } = state;
    return squares.reduce((acc, square, position) => {
        if (!square) {
            const player = xIsNext ? 'X' : 'O';
            return acc.concat({ player, position });
        }
        return acc;
    }, []);
}

export function calculateWinner(state) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const { squares } = state;
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export function isGameOver(state) {
    return calculateWinner(state) || getAvailableMoves(state).length === 0;
}

export function getScore(state) {
    const winner = calculateWinner(state);
    let score = 0;
    // X is the human player. We attribute a negative score to the human player.
    if (winner === 'X') {
        score = -(1 + getAvailableMoves(state).length);
    } else if (winner === 'O') {
        score = 1 + getAvailableMoves(state).length;
    }
    return score;
}