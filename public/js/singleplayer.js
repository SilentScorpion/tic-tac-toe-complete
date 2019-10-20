
import {game} from './menu.js';

export class SinglePlayer extends Phaser.Scene{

    constructor(){
        super('SinglePlayer');
    }

    create(){
        console.log('hello world');
        this.title = this.add.text(game.config.width/2, 150, 'Tic Tac Toe',{'fontSize': '36px'}).setOrigin(.5,.5);
        this.title.tint = 0x000000;

        this.gridone = [0,1,2,3,4,5,6,7,8];

        //Graphics ...Draw lines to visualize the grid
        var graphicsconfig = {
            lineStyle: {
                color: 0x000000,
                alpha : 1,
                width: 10,
            },
            fillStyle: {
                color : 0x000000,
                alpha : 1
            },
        };
        this.graphicsObj = this.add.graphics(graphicsconfig);
        
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 150, game.config.height/3 + 50, game.config.width/2 +150, game.config.height/3 + 50));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 150, game.config.height/3 + 150, game.config.width/2 +150, game.config.height/3 + 150));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 - 50, game.config.height/3 - 50, game.config.width/2 - 50, game.config.height/3 + 250));
       this.graphicsObj.strokeLineShape(new Phaser.Geom.Line(game.config.width/2 + 50, game.config.height/3 - 50, game.config.width/2 +50, game.config.height/3 + 250));
      
        //2D Grid
        //0 is unused, 1 is X, 2 is 0
        //Initialize
        this.grid = [[]];
        for(let i = 0 ; i < 3 ; i++){
            this.grid[i] = [];
            for(let j = 0 ; j < 3 ; j++){
                let x = game.config.width/3 + j * 100;
                let y = game.config.height/3 + i * 100;
                let cell = this.add.text(x,y,'Q',{'fontSize': '100px'}).setOrigin(.5,.5);
                cell.tint = 0xffffff;
                cell.setInteractive();
                cell.name =  '' + i + j;
                this.grid[i][j] = {
                    c : cell,
                    v : 0,
                }
            }
        }

        console.log(this.grid);

        //Player's turn first, Player ===>> 1, CPU ===> 2
        this.turn = 1;
        this.playerVal = 0;

        //Set Input
        this.input.on('gameobjectdown' , (pointer, gameobject) => {
            console.log('here');
            if(gameobject.name == 'menu')
                return;
            if(this.turn == 1){
                console.log('now here');
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.text = "X";
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.tint = 0xff0000;

                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].v = 1;
                this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.setInteractive(false);
                
                var i = parseInt(gameobject.name.charAt(0));
                var j = parseInt(gameobject.name.charAt(1));
                //i==0, j==0 [1,1] =====> 0,1,2,3,4,5
                this.gridone[i * 3 + j] = "X";
                console.log("h1" + this.gridone);
                this.turn = 2;
                this.time.addEvent({
                    delay: 500,
                    callback:() => { 
                        this.playCPU();
                      
                    },
                    loop:false,
                },this);

            }
        });

        this.restart = this.add.text(game.config.width/2, game.config.height* 2/3 +100, 'Restart', {'fontSize': '40px'}).setOrigin(.5,.5);
        this.restart.setInteractive().on('pointerdown', () => {
            this.scene.start(this);
        });
        this.restart.tint = 0xff0000;

        this.menu = this.add.text(game.config.width/2, game.config.height* 2/3 +200, 'Main Menu', {'fontSize': '40px'}).setOrigin(.5,.5);
        this.menu.setInteractive().on('pointerdown', () => {
            this.scene.start('Menu');
        });
        this.menu.name = 'menu';
        this.menu.tint = 0xff0000;

        
        this.winner = this.add.text(game.config.width/2, game.config.height* 2/3, 'You Win', {'fontSize': '60px'}).setOrigin(.5,.5);
        this.winner.setVisible(false);
        this.winner.tint = 0x0000ff;


        this.moveNo = 0;
    }

    playCPU(){
        //console.log('cpus turn');
              //Call the minmax algorithm here
        
        var m = minimax(this.gridone,"O");
        console.log(m.index);
        if(m.index != null){
            let x = Math.trunc(m.index / 3);
            let y = m.index % 3;
          console.log(m);
          this.grid[x][y].c.text = "O";
          this.grid[x][y].c.tint = 0x0000ff;
          this.grid[x][y].v = 2;
          this.grid[x][y].c.setInteractive(false);
           this.turn = 1;
          this.gridone[x * 3 + y] = "O";
        }
        else{
            //Game draw condition
            this.winner.text = "DRAW";
            this.winner.setVisible(true);
        }
    }

    update(){
        if(this.gameRules(this.grid, 1)){
            console.log('You Win');
            this.winner.text = 'You Win!!!!';
            this.winner.setVisible(true);
            this.turn = 0;

        }
        else if(this.gameRules(this.grid , 2)){
            this.winner.text = 'CPU Wins :(((';
            this.winner.setVisible(true);
            console.log('cpu wins');
            this.turn = 0;
        }
    }


    gameRules(grid,s1){
        //Takes in the current state of the grid as the input
        if(grid[0][0].v == s1 && grid[0][1].v == s1 && grid[0][2].v == s1 ||
            grid[1][0].v == s1 && grid[1][1].v == s1 && grid[1][2].v == s1 ||
            grid[2][0].v == s1 && grid[2][1].v == s1 && grid[2][2].v == s1 || 

            grid[0][0].v == s1 && grid[1][0].v == s1 && grid[2][0].v == s1 ||
            grid[0][1].v == s1 && grid[1][1].v == s1 && grid[2][1].v == s1 ||
            grid[0][2].v == s1 && grid[1][2].v == s1 && grid[2][2].v == s1 || 

            grid[0][0].v == s1 && grid[1][1].v == s1 && grid[2][2].v == s1 ||
            grid[0][2].v == s1 && grid[1][1].v == s1 && grid[2][0].v == s1
            ){
                return true;
            }
            else{
                return false;
            }
    }

};

// the main minimax function
function minimax(newBoard, player){
  
   
    //available spots
    var availSpots = emptyIndexies(newBoard);
  
    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, "X")){
       return {score:-10};
    }
      else if (winning(newBoard, "O")){
      return {score:10};
      }
    else if (availSpots.length === 0){
        return {score:0};
    }
  
  // an array to collect all the objects
    var moves = [];
  
    // loop through available spots
    for (var i = 0; i < availSpots.length; i++){
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {};
        move.index = newBoard[availSpots[i]];
  
      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;
  
      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == "O"){
        var result = minimax(newBoard, "X");
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, "O");
        move.score = result.score;
      }
  
      //reset the spot to empty
      newBoard[availSpots[i]] = move.index;
  
      // push the object to the array
      moves.push(move);
    }
  
  // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if(player === "O"){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
  
  // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
  
  // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
  }
  
  // returns the available spots on the board
  function emptyIndexies(board){
    return  board.filter(s => s != "O" && s != "X");
  }
  
  // winning combinations using the board indexies for instace the first win could be 3 xes in a row
  function winning(board, player){
   if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
  }
  


