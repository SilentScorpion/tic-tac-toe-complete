import {SinglePlayer} from "./singleplayer.js";
import Multiplayer from './multiplayer.js';

class Menu extends Phaser.Scene {
    constructor(){
        super('Menu');
    }

    create(){
        console.log('hello world');
        this.add.text(game.config.width/2, 200, 'Tic Tac Toe', {'fontSize' : '80px', 'color': '#f00'}).setOrigin(.5,.5);

        this.add.text(game.config.width/2, game.config.height/2 -100, 'Select Mode',{'fontSize' : '40px', 'color': '#000'}).setOrigin(.5,.5);


        this.add.text(game.config.width/2, game.config.height/2, 'vs AI',{'fontSize' : '50px', 'color': '#00f'}).setOrigin(.5,.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('SinglePlayer');
        }); 
        this.add.text(game.config.width/2, game.config.height/2 +50, 'Try and beat the AI! \nYou play the first move',{'fontSize' : '24px', 'color': '#999', 'align' : 'center'}).setOrigin(.5,.5);

        this.add.text(game.config.width/2, game.config.height/2 + 150, '2 Player',{'fontSize' : '50px', 'color': '#00f'}).setOrigin(.5,.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Multiplayer');
        }); 
        this.add.text(game.config.width/2, game.config.height/2 +200, 'Play against an online opponent..',{'fontSize' : '24px', 'color': '#999', 'align' : 'center'}).setOrigin(.5,.5);


           
     
        
        this.add.text(game.config.width/2, game.config.height - 100, '#100DaysOfCode',{'fontSize' : '40px', 'color': '#bbb'}).setOrigin(.5,.5);

    }
}

var config = {
    parent:'tictactoe',
    type: Phaser.AUTO,
    width: 600,
    height: 1200,
    backgroundColor: 0xffffff,
    scene: [Menu, SinglePlayer,Multiplayer],
    scale: {
        mode: Phaser.Scale.FIT  ,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

export var game = new Phaser.Game(config);