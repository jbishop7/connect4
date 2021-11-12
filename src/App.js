import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
class Game extends React.Component{
 
  //some HTML formatting and also creating my game board. I didn't create it dynamically. It wasn't required and I couldn't figure it out initially...
  //my code is kinda wishy washy. It is a little odd. But the game works. If I had a chance to redo this game I would do it a completely different way. 
  render(){
    return (
      <div id = "GameContainer" style = {
        {marginRight: 20+'%', marginLeft: 20+'%', marginTop: 5+'%', borderWidth: 3+'px', borderColor: 'pink', borderStyle: 'solid'
        , paddingTop: 1+'em', paddingLeft: 2+'em', paddingRight: 2+'em', paddingBottom: 1+'em'}
        }>
        
        <div id = "WinnerLabel"><WinnerLabel/>  
          <div id = "GameSpace">
            <Cell r='5' c='0'/><Cell r='5' c='1'/><Cell r='5' c='2'/><Cell r='5' c='3'/><Cell r='5' c='4'/><Cell r='5' c='5'/><Cell r='5' c='6'/>

            <Cell r='4' c='0'/><Cell r='4' c='1'/><Cell r='4' c='2'/><Cell r='4' c='3'/><Cell r='4' c='4'/><Cell r='4' c='5'/><Cell r='4' c='6'/>

            <Cell r='3' c='0'/><Cell r='3' c='1'/><Cell r='3' c='2'/><Cell r='3' c='3'/><Cell r='3' c='4'/><Cell r='3' c='5'/><Cell r='3' c='6'/>

            <Cell r='2' c='0'/><Cell r='2' c='1'/><Cell r='2' c='2'/><Cell r='2' c='3'/><Cell r='2' c='4'/><Cell r='2' c='5'/><Cell r='2' c='6'/>

            <Cell r='1' c='0'/><Cell r='1' c='1'/><Cell r='1' c='2'/><Cell r='1' c='3'/><Cell r='1' c='4'/><Cell r='1' c='5'/><Cell r='1' c='6'/>

            <Cell r='0' c='0'/><Cell r='0' c='1'/><Cell r='0' c='2'/><Cell r='0' c='3'/><Cell r='0' c='4'/><Cell r='0' c='5'/><Cell r='0' c='6'/>
              
          </div>
        </div>
      </div>

    );

  }
}

//HTML label that holds the label. Doesn't actually do anything for the winner. Just updates whos turn it is. 
class WinnerLabel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      msg: "your move yellow..."
    }
  }

  tick(){ //this updates the turn every tick. Pretty nifty. 
    if (turn ==1){
      this.setState(state => ({
        msg: 'your move red...'
      }
      ));
    }
    if (turn ==0){
      this.setState(state => ({
        msg: 'your move yellow...'
      }
      ));
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render(){
    return(
      <label>{this.state.msg}</label>
    );
  }
}
let turn = 0; //some global variables. I WOULDNT NEED THESE IF I COULD CODE IT AGAIN. They would all be stored in a single class. But here we are. 
let board = Array.from(Array(7), () => new Array(6).fill(null));  //the game board. It is static. 
let gameOver = false; //game over condition
let cellsFilled = -1; //long story... when updating the number of cells, it always increments by 2. I don't know why. 


function switchUser(){
    turn++;
    turn = turn%2;  //function to change whos turn it is. 
    return turn;
}

class Cell extends React.Component{   //this is where all the game logic is. Once again if I could redo it I wouldn't have all these different classes. Game logic should be stored elsewhere. 
  constructor(props){
    super(props);
    this.state = {
      bgColor: "",
      used: "no", 
      r: props.r,
      c: props.c
    }
    
  }

  //next 2 functions are used when turning a cell to red or yellow. 
  redCell(){  
    this.setState((state)=>{
      
      board[this.state.c][this.state.r] = 'red';  //update the game board array. 
      console.log(this.state.c + ", " + this.state.r + " coloured " + board[this.state.c][this.state.r]); //for tracing purposes. Just helped me troubleshoot. 
      this.checkWin();  //check win on every call
      return {bgColor:"red", used:"yes"}  //update the state. 
    }
    );
  }

  yellowCell(){
    this.setState((state)=>{
      
      board[this.state.c][this.state.r] = 'yellow';
      console.log(this.state.c + ", " + this.state.r + " coloured " + board[this.state.c][this.state.r]);
      this.checkWin();
      return {bgColor:"yellow", used:"yes"}
    }
    
    );
  }

  checkWin(){
    cellsFilled++;
    //console.log(cellsFilled); 
    let rowCheck = 0; //stores the number of values in a row that are the same and beside each other
    let colCheck = 0; //same but for columns

    

    //check the last row that was used. We are checking horizontal. 
    for(let c = 0; c <=6; c++){
      if (board[c][this.lastRow] == this.lastColour){ //if the value matches the colour we are checking, increment row check
        rowCheck++;
        console.log(this.lastColour + "rowCheck " + rowCheck);  //for tracing
        if (rowCheck >= 4 && !gameOver){
          alert(this.lastColour + " has won horizontally! Refresh the page to play again.")
          gameOver = true;
          break;  //if we get 4 in a row, break the for loop. Game is over. 
        }
      }else{
        rowCheck =0;  //if it doesnt match, reset the counter. 
      }
    }

    //check vertically!
    for (let r = 0; r <= 5; r++){
      if (board[this.lastCol][r] == this.lastColour){
        colCheck++;
        console.log(this.lastColour + "colCheck " + colCheck);
        if (colCheck >= 4 && !gameOver){
          alert(this.lastColour + " has won vertically! Refresh the page to play again.")
          gameOver = true;
          break;
        }
      }else{
        colCheck =0;  //if it doesnt match, reset the counter. 
      }
    }
    
  }

  setLast(a, b, c){
    this.lastColour = a;    //sets some local variables that we use for checking. 
    this.lastRow = b;
    this.lastCol = c;
  }

  handleClick = (e) =>{
      if (gameOver == false){ //if the game is still going...
        
        if (this.state.used =="no"){  //if cell is empty
          switchUser(); //switch turn
        }    
        if (turn==1 && this.state.used == "no"){
          this.setLast("yellow", this.state.r, this.state.c); //set local variables
          
          this.yellowCell();  //make cell yellow
          //this.checkWin();
        }
        if (turn==0 && this.state.used == "no"){  //same as above but for red
          this.setLast("red", this.state.r, this.state.c);
          
          this.redCell();
          
        } 
    }else{
      alert("Refresh the page to play again!"); //if game is over then tell user to refresh the page. 
    }

  }

  render(){
    if (cellsFilled >= 80){ //check if game board is filled
      gameOver = true;
      alert("Draw!");
    }
    return(
    <button style = {
      {width: 12+'%', height: 8+'em', marginLeft: 1+'%', marginRight: 1+'%', marginBottom: 1+'%', backgroundColor: this.state.bgColor}
      } onClick = {this.handleClick}>

      </button>
    );
  }
} 


function App() {
  return (
    <div>
      <Game/>
    </div>
  );
}

export default App;
