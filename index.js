var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var signalService = require('./backend/Routes/SignalService');
var DatabaseService = require('./backend/Routes/DatabaseService');
var Database = require('./backend/Model/Database')

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
        DatabaseService.LoadData();
        Database.ValueEvent.on('LoadFirstDataDatabase',function(data)
        {
          Database.ValueEvent.on('LoadFirstDataDatabaseUnity',function(dataa)
          {
            Database.ValueEvent.on('LoadFirstDataDatabaseCategory',function(dataaa)
            {
              //console.log(data);
              socket.emit('PreDonnee', data, dataa, dataaa);
            });
          });
        });
        Database.ValueEvent.on('LoadSecondDataDatabase',function(data2){socket.emit('PreDonnee2', data2)});
    });

});


io.on('connection', function (socket) {
    socket.on('search', function (idN, category, unity, startDate, endDate) {
        DatabaseService.QuerySearch(idN, category, unity, startDate, endDate);
        Database.ValueEvent.on('SearchDataDatabase',function(dataSearch){socket.emit('SearchData', dataSearch)});
    });

});


io.on('connection', function (socket) {
    socket.on('storeSignal', function (signal) {
        DatabaseService.StoreSignal(signal);
    });

});

io.on('connection', function (socket) {
    socket.on('storeSignalData', function (signalData) {
        DatabaseService.StoreSignalData(signalData);
    });

});
