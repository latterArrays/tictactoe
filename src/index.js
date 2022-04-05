import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

// Function Component
function Square(props) {

    if (props.winner === true) {
        return (
            <button className="winnersquare" onClick={props.onSquareClick}>
                {props.value}
            </button>
        )
    }
    else {
        return (
            <button className="square" onClick={props.onSquareClick}>
                {props.value}
            </button>
        )
    }
}

// React Component
class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(''),
                xIsNext: true,
                gameOver: false,
                status: "Welcome! Player X Starts the Game.",
                gameClicks: 0
            }],
            currentTime: 0,
            winningSquares: {
                a: '',
                b: '',
                c: ''
            }
        };
    }

    getCurrentState() {
        return this.getStateHistory(this.state.currentTime)
    }

    getStateHistory(time) {
        return this.state.history[time]
    }

    handleClick(i) {
        const squares = this.getCurrentState().squares.slice()
        if (squares[i] != '' || this.getCurrentState().gameOver) {
            return
        }
        squares[i] = this.getCurrentState().xIsNext ? 'X' : 'O'

        // By changing the whole state at once, this means we can store a history of immutable states for an timeline
        // Immutable states also mean we can detect changes more easily, instead of checking every variables, we just check the whole state
        // So if we throw every state into an array every time it changes, we can time travel the game without needing to reset every variable individually

        const winner = calculateWinner(squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner
            this.updateState(squares, this.getCurrentState().xIsNext, true, status, this.getCurrentState().gameClicks + 1)
            this.setState({winningSquares: { a: winner.a, b: winner.b, c: winner.c } })

        }
        else {
            if (this.getCurrentState().gameClicks < 8) {
                status = 'Next player: ' + (!this.getCurrentState().xIsNext ? 'X' : 'O');
            }
            else {
                status = "Game Over! It's a tie. "
            }
            this.updateState(squares, !this.getCurrentState().xIsNext, false, status, this.getCurrentState().gameClicks + 1)
        }

    }

    // Create a new history point with the new state variables, then set the state using the prior history up to this new move
    updateState(squares, xIsNext, gameOver, status, gameClicks) {
        let time = this.state.currentTime + 1
        let historySlice = this.state.history.slice(0, time)
        let newHistory = {
            squares: squares,
            xIsNext: xIsNext,
            gameOver: gameOver,
            status: status,
            gameClicks: gameClicks
        }

        let newState = {
            history: historySlice.concat(newHistory),
            currentTime: time
        }

        this.setState(newState)
    }

    renderSquare(i) {

        if (this.getCurrentState().gameOver && (i === this.state.winningSquares.a || i === this.state.winningSquares.b || i === this.state.winningSquares.c)) {
            // Draw a winner square at i
            return (
                <Square
                    value={this.getCurrentState().squares[i]}
                    onSquareClick={() => this.handleClick(i)}
                    winner={true}
                />
            )
        }
        else {
            return (
                <Square
                    value={this.getCurrentState().squares[i]}
                    onSquareClick={() => this.handleClick(i)}
                />
            )
        }

    }

    jumpTo(step) {
        this.setState({
            currentTime: step
        })
    }

    render() {

        const history = this.state.history;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button className="timeButton" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div>
                <div className="status">{this.getCurrentState().status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <ol>{moves}</ol>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                a: a,
                b: b,
                c: c
            };
        }
    }
    return null;
}

// Matt idea: Make a two player tic tac toe game using websockets for your portfolio