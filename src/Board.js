import React, { useReducer } from 'react';
import Square from "./Square";
import './Board.css';
import { calculateWinner, getAvailableMoves, initialState, reducer } from "./tictactoe";

const Board = () => {
    const [state, dispatch] = useReducer(reducer, initialState());

    const handleClick = position => () => {
        const { squares, xIsNext } = state;
        if (squares[position] || !xIsNext || calculateWinner(state)) {
            return null;
        }
        dispatch({ type: 'move', payload: { player: 'X', position } });
    };

    const renderSquare = (i) => {
        const { squares } = state;
        return (
            <Square value={squares[i]} onClick={handleClick(i)}/>
        );
    };

    const winner = calculateWinner(state);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (getAvailableMoves(state).length === 0) {
        status = 'Draw!';
    } else {
        status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
    }

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

export default Board;
