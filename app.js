



var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.use(express.static(__dirname + "/public"));


//Main logic here
var players = [];

io.on('connection', function (socket) {
 players.push(socket.id);
 socket.emit('welcome', {playerCount: players.length});


 if(players.length == 2){
    io.emit('startgame', {turn: players[0]});
 }
   

    socket.on('move', (data) => {
        var sendObj = {};
        if(data.turn == players[0]){
            sendObj.turn = players[1];
            sendObj.v = "O";
            //grid[data.x][data.y] = "X";
            console.log('2s turn' + data.winner);
        }
        
        else if(data.turn == players[1]){
            sendObj.turn = players[0];
            sendObj.v = "X";
           // grid[data.x][data.y] = "O";
            console.log('1s turn');
        }
        

        sendObj.x = data.x;
        sendObj.y = data.y;
        sendObj.winner = data.winner;

        io.emit('move', sendObj);

        
     
    });

 socket.on('disconnect', () => {
     players.pop();
     console.log(socket.id + ' Player disconnected' + players.length);

 });
});