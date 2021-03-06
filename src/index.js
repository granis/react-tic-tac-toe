import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button onClick={props.onClick} className={"square " + props.winningClass}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningClass = "";
    if (this.props.winningSquares !== null) {
      if (this.props.winningSquares.includes(i)) {
        winningClass = "winner";
      }
    }
    return (
      <Square
        winningClass={winningClass}
        key={i} /* items wont be re-arranged, use index as key! */
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRowsAndSquares = () => {
    let rows = [];
    /* loop every row */
    for (let i = 0; i < 3; i++) {
      let thisRow = [];
      /* loop every square (cell) */
      for (let j = 0; j < 3; j++) {
        thisRow.push(this.renderSquare(j + i * 3));
      }
      rows.push(
        <div key={i} className="board-row">
          {thisRow}
        </div>
      );
    }
    return rows;
  };

  render() {
    return <div>{this.renderRowsAndSquares()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      XIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [winner] = calculateWinner(current.squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.XIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext,
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, XIsNext: step % 2 === 0 });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winningSquares] = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      let currentMove = "";

      if (this.state.stepNumber === move) {
        currentMove = "currentMove";
      }

      return (
        <li key={move}>
          <button className={currentMove} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.XIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winningSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
