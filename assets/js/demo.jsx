import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';


export default function game_init(root, channel) {
  ReactDOM.render(<Game channel={channel} />, root);
}


// present each card
function Card(props) {
  return (
    <button className={props.status} onClick={props.onClick}>
      {props.value}
    </button>
  );
}



// present the game board that contains 16 cards
function Board(props) {
  let board = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(<Card value={props.cardsValue[i*4+j]}
                     status={props.cardsStatus[i*4+j]}
                     onClick={() => props.onClick(i*4+j)} />);
    }
    board.push(<div className="board-row">{row}</div>);
  }
  return (<div>{board}</div>);
}


// the game component
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;

    this.state = {
      isPaused: false,
      preCard: -1,
      clickNumber: 0, // number of clicked
      cardsValue: [], // cards' value
      cardsStatus: Array(16).fill('hide'), // cards' status
    };

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
  }

  // set state based on the view passed from channel
  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);
    if (view.game.isPaused)
      this.sendUnPause();
    if (view.game.isWin) {
      alert("You Win! Steps: " + this.state.clickNumber);
      this.sendRestart();
    }
  }

  // send click event to channel
  sendClick(i) {
      if (!this.state.isPaused)
        this.channel.push("click", {num: i})
          .receive("ok", this.gotView.bind(this));
  }
  
  // send resatrt signal to channel
  sendRestart() {
      this.channel.push("restart", {})
        .receive("ok", this.gotView.bind(this));
  }

  // send un-pause signal to channel, set isPaused to false
  sendUnPause() {
      this.channel.push("unpause", {})
        .receive("ok", this.gotView.bind(this));      
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            cardsValue={this.state.cardsValue}
            cardsStatus={this.state.cardsStatus}
            onClick={(i) => this.sendClick(i)}
          />
        </div>
        <div className="game-info">
          <p>clicks: {this.state.clickNumber}</p>
          <button className="restart" onClick={()=>this.sendRestart()}>restart</button>
          <button id="logout">logout</button>
        </div>
      </div>
    );
  }

}


