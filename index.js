var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var signalService = require('./backend/Routes/SignalService')
var database = require('./backend/Routes/DatabaseService')
var events = require('events');

//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname + '/frontend/'));

//listening the node server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
})

//createSignal
io.on('connection', function (socket) {
    socket.on('createSignal', function (signalValues) {
        signalService.createSignal(signalValues);
        signalService.signalServiceEvent.on('errorSignalId', function(message){socket.emit('errorSignalId', message)});

    });

});

//activateSignal
io.on('connection', function (socket) {
    socket.on('activateSignal', function () {

        signalService.signalServiceEvent.on('newValueHasGenerate',function(val){socket.emit('newValue', val)});
        signalService.activateSignal();
    });

});

io.on('connection', function (socket) {
    socket.on('getSignalInfos', function (signalId) {

        signalService.signalServiceEvent.on('signalInfos',function(val){socket.emit('signalInfos', val)});
        signalService.getSignalInformations(signalId);
    });

});

io.on('connection', function (socket) {
    socket.on('updateSignal', function (generatorInfos) {
        signalService.updateSignal(generatorInfos);
    });

})

//Database queries
io.on('connection', function (socket) {
    socket.on('loadDB', function () {

        database.queryLoad();
        database.PreloadValueEvent.on('LoadFirstData',function(data){socket.emit('PreDonnee', data)});
        database.PreloadValueEvent.on('LoadSecondData',function(data2){socket.emit('PreDonnee2', data2)});
    });

});


io.on('connection', function (socket) {
    socket.on('search', function (idN, category, unity, startDate, endDate) {

        database.QuerySearch(idN, category, unity, startDate, endDate);
        database.PreloadValueEvent.on('SearchData',function(dataSearch){socket.emit('SearchData', dataSearch)});
        //console.log(idN + " ; "+ category + " ; "+ unity + " ; "+ startDate + " ; "+ endDate)

    });

});
