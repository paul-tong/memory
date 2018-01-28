import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Game />, root);
}

// component to present each card
function Card(props) {
  return (
    <button className={props.status} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// component to present the game board that contains 16 cards
class Board extends React.Component {
  renderCard(i) {
    return (
      <Card
        value={this.props.cardsValue[i]}
        status={this.props.cardsStatus[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
          {this.renderCard(3)}
        </div>
        <div className="board-row">
          {this.renderCard(4)}
          {this.renderCard(5)}
          {this.renderCard(6)}
          {this.renderCard(7)}
        </div>
        <div className="board-row">
          {this.renderCard(8)}
          {this.renderCard(9)}
          {this.renderCard(10)}
          {this.renderCard(11)}
        </div>
        <div className="board-row">
          {this.renderCard(12)}
          {this.renderCard(13)}
          {this.renderCard(14)}
          {this.renderCard(15)}
        </div>        
      </div>
    );
  }
}


// the game component
class Game extends React.Component {
  constructor(props) {
    super(props);
    const cardsValue = getCardsValue();
    this.state = {
      clickNumber: 0,
      preCard: null,
      cardsValue: cardsValue,
      cardsStatus: Array(16).fill('hide'),
      isPaused: false,
    };
  }

  // handle click event
  handleClick(i) {
    if (this.state.isPaused) return; // can't click if it's in paused state
    let cardsStatus = this.state.cardsStatus.slice();
    let preCard = this.state.preCard;
    
    // click effect only when this card is hide previously
    if (cardsStatus[i] === 'hide') {
      cardsStatus[i] = 'open'; // open it anyway
      if (preCard === null) { // is the first clicked card
        this.setState({
          cardsStatus: cardsStatus,
          preCard: i,
          clickNumber: this.state.clickNumber + 1,
          isPaused: false,
        });        
      }
      else { // is the second clicked card
        this.setState({
          cardsStatus: cardsStatus,
          clickNumber: this.state.clickNumber + 1,
          isPaused: true,
        }, this.delayHandleClick(i)); // callback the delay function       
      }
    }
  }
  
  // handle the click after delay 1 second
  delayHandleClick(i){
    let cardsStatus = this.state.cardsStatus.slice();
    let preCard = this.state.preCard; // previous card id
    let preValue = this.state.cardsValue[preCard]; // previous value
    let cliValue = this.state.cardsValue[i]; // value clicked
    
    if (preValue === cliValue) { // match wiht first clicked card
      cardsStatus[preCard] = 'removed'; //remove both cards
      cardsStatus[i] = 'removed';
    }
    else { // didn't match with first clicked card
      cardsStatus[preCard] = 'hide'; // hide both cards
      cardsStatus[i] = 'hide';
    }        
    preCard = null;
    
    setTimeout(function() { 
      this.setState({  
        preCard: preCard,
        cardsStatus: cardsStatus,
        isPaused: false,
      }); }.bind(this), 1000);
  }
  
  // restart the game
  restart(){
    let cardsValue = getCardsValue(); // get new cards' value
    this.setState({
      clickNumber: 0,
      preCard: null,
      isPaused: false,      
      cardsValue: cardsValue,
      cardsStatus: Array(16).fill('hide'),
    });   
  }
  
  render() {
    let message;
    if(checkWin(this.state.cardsStatus)){
      alert("You Win! Steps: " + this.state.clickNumber);
      message = 'clicks: ' + 0;      
      this.restart();
    }
    else{ 
      message = 'clicks: ' + this.state.clickNumber;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            cardsValue={this.state.cardsValue}
            cardsStatus={this.state.cardsStatus}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <p>{message}</p>
          <button className="restart" onClick={()=>this.restart()}>restart</button>
        </div>
      </div>
    );
  }
}

// ========================================
// render the game component to DOM
/*ReactDOM.render(
  <Game />,
  document.getElementById('game')
);*/




// ==============================================================
// get cards' value in randomly order
function getCardsValue() {
  
  let values = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 
                'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']
  shuffleArray(values);
  return values;
}

// shuffle array to randomize the order of cards
// attribution: Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// check whether all cards are removed
function checkWin(cardsStatus) {
  for (let i in cardsStatus) {
    if (cardsStatus[i] !== 'removed')
      return false;
  }
  return true;
}

