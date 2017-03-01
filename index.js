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


io.on('connection', function (socket) {
    socket.on('createSignal', function (signalValues) {
        signalOperation.createSignal(signalValues);
    });

});


io.on('connection', function (socket) {
    socket.on('activateSignal', function () {

        signalOperation.newValueEvent.on('newValueHasGenerate',function(val){socket.emit('newValue', val)});
        signalOperation.activateSignal();
    });

});


