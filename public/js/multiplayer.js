import {game} from './menu.js';

var playerCount;
var socket;

export default class Multiplayer extends Phaser.Scene {
    constructor(){
        super('Multiplayer');
        
    }

    create(){
        //Connection to the server
        socket =  io.connect('http://localhost');

        socket.on('welcome', (data) => {
          console.log('player connected');
            playerCount = data.playerCount;
            this.ui();
        });


        socket.on('startgame', (data) => {
            this.clearUI();
            this.startGame();
            this.turn = data.turn;
            if(data.turn == socket.id){
                this.turnText.setVisible(true);
            }
            else{
                this.turnText.text = "Opponent's turn!";
                this.turnText.setVisible(true);
            }
        });

        socket.on('move' , (data) => {
            this.turn = data.turn;
            this.v = data.v;
            if(this.turn == socket.id){
                if(this.v == "O"){

                    this.grid[data.x][data.y].c.text = "X";
                    this.grid[data.x][data.y].c.tint = 0xff0000;
    
                    this.grid[data.x][data.y].v = 1;
                    this.grid[data.x][data.y].c.setInteractive(false);
                    
                    var i = parseInt(data.x);
                    var j = parseInt(data.y);
                    //i==0, j==0 [1,1] =====> 0,1,2,3,4,5
                    this.gridone[i * 3 + j] = "X";
    
                    this.turnText.text = "Your turn";

                            //Check for winner status
                        if(data.winner == 1){
                            console.log('hashhah');
                            this.turnText.text = "You Lose :(";
                        }
                        else if(data.winner == 2){
                            this.turnText.text = "You Win ;)";
                        }
                
                }
                else if(this.v == "X"){
    
                    this.grid[data.x][data.y].c.text = "O";
                    this.grid[data.x][data.y].c.tint = 0x0000ff;
    
                    this.grid[data.x][data.y].v = 2;
                    this.grid[data.x][data.y].c.setInteractive(false);
                    
                    var i = parseInt(data.x);
                    var j = parseInt(data.y);
                    //i==0, j==0 [1,1] =====> 0,1,2,3,4,5
                    this.gridone[i * 3 + j] = "O";
    
                    this.turnText.text = "Your turn";

                          //Check for winner status
                          if(data.winner == 2){
                            console.log('hashhah');
                            this.turnText.text = "You Lose :(";
                        }
                        else if(data.winner == 1){
                            this.turnText.text = "You Win ;)";
                        }
                }
                

              
            }
            
        });


        
    }

    ui(){
     
        this.msg1 = this.add.text(game.config.width/2, game.config.height/2, 'Finding an Opponent...', {'fontSize': '40px','color' : '#00f'}).setOrigin(.5,.5);
     
        this.msg2 = this.add.text(game.config.width/2, game.config.height/2 - 150, playerCount, {'fontSize': '25px','color' : '#00f'}).setOrigin(.5,.5);
    
        this.msg3 = this.add.text(game.config.width/2, 100, '2 Player Mode', {'fontSize': '40px','color' : '#000'}).setOrigin(.5,.5);
    
        this.turnText = this.add.text(game.config.width/2, game.config.height - 300, 'Your Turn', {'fontSize': '60px','color' : '#000'}).setOrigin(.5,.5);
        this.turnText.setVisible(false);

        this.menu = this.add.text(game.config.width/2, game.config.height* 2/3 +200, 'Return', {'fontSize': '40px'}).setOrigin(.5,.5);
        this.menu.setInteractive().on('pointerdown', () => {
            socket.close();
            this.scene.start('Menu');
        });
        this.menu.name = 'menu';
        this.menu.tint = 0xff0000;
    }

    clearUI(){
       
        this.msg1.setVisible(false);
        this.msg2.setVisible(false);
        this.msg3.setVisible(false);
      
        
    }

    startGame(){

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
        //Player's turn first, Player ===>> 1, CPU ===> 2
        this.playerVal = 0;
        this.v = "X";

        //Set Input
        this.input.on('gameobjectdown' , (pointer, gameobject) => {
            if(gameobject.name == 'menu')
                return;
            if(this.turn == socket.id){
                var winner = 0;
             
                console.log('player has clicked button ===');
                if(this.v == "X"){
                    console.log('X turn');
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.text = "X";
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.tint = 0xff0000;
    
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].v = 1;
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.setInteractive(false);
                    
                    var i = parseInt(gameobject.name.charAt(0));
                    var j = parseInt(gameobject.name.charAt(1));
                    //i==0, j==0 [1,1] =====> 0,1,2,3,4,5
                    this.gridone[i * 3 + j] = "X";
                    console.log("h1" + this.gridone);
                    if(this.gameRules(this.grid,1)){
                        this.turnText.text = "You Win!!";
                        winner = 1;
                        console.log('hello');
                    }
                    else{
                        this.turnText.text = "Opponent's turn";
                    }
                  
                }
                else if(this.v == "O"){
                    console.log('O turn');
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.text = "O";
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.tint = 0x0000ff;
    
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].v = 2;
                    this.grid[gameobject.name.charAt(0)][gameobject.name.charAt(1)].c.setInteractive(false);
                    
                    var i = parseInt(gameobject.name.charAt(0));
                    var j = parseInt(gameobject.name.charAt(1));
                    //i==0, j==0 [1,1] =====> 0,1,2,3,4,5
                    this.gridone[i * 3 + j] = "O";
                  
                    if(this.gameRules(this.grid, 2)){
                        this.turnText.text = "You Win!!";
                        winner = 2;
                    }
                    else{
                        this.turnText.text = "Opponent's turn";
                    }
    

                }

               
               
                socket.emit('move', {turn:socket.id,x: i, y: j, winner: winner});
               

                

            }
        });


      
    }

    gameRules(grid,s1){
        //Takes in the current state of the grid as the input
        if(grid[0][0].v == s1 && grid[0][1].v == s1 && grid[0][2].v == s1 ||
            grid[1][0].v == s1 && grid[1][1] == s1 && grid[1][2] == s1 ||
            grid[2][0].v == s1 && grid[2][1] == s1 && grid[2][2] == s1 || 

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
}
