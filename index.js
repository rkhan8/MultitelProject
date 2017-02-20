var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var signalOperation = require('./backend/Routes/SignalOperations')
var events = require('events');



//var pathcsv = __dirname + '/frontend/';

//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname + '/frontend/'));



//listening the node server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
})

io.on('connection', function(socket)
{
  var recu = "";

  socket.on('sending_view1', function(msg){

    recu = msg["message"];
    {
      //console.log(recu[0]);
      signalOperation.getobj(recu[0], recu[1], LoadVal);
    }


  });
});

var LoadVal = function(err, result){
  console.log(result);

  io.on('connection', function (socket2) {
    var msg2 = result;
    socket2.emit("sending_values", {
        message2: msg2
    });
  });
  
}








/*
io.on('connection', function (socket, signalValues) {
    socket.on('createSignal', function (signalValues) {
        signalOperation.createSignal(signalValues);
    });

    socket.on('activateSignal', function (socket) {

        signalOperation.newValueEvent.on('newValueHasGenerate',function(val){socket.emit('newValue', val)});
        signalOperation.activateSignal();
    });
});
*/
