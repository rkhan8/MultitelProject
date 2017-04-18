var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var signalService = require('./backend/Service/SignalService')
var persistanceService = require('./backend/Service/PersistenceService')
var events = require('events');


//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname + '/frontend/'));

//listening the node server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
})

persistanceService.persistenceEvent.on('signalsId', function (signalsId) {
    io.sockets.emit('signalsId', signalsId);
});

persistanceService.persistenceEvent.on('signalCreateError', function (signalId) {
    io.sockets.emit('errorExistingSignalId', {
        signalId: signalId,
        message: 'Ce signal existe deja dans la base de donnée'
    });
});

signalService.signalServiceEvent.on('newValueHasGenerate', function (val) {
    persistanceService.saveSignalValue(val.signalId, val.value);
    io.sockets.emit('newValue', val);
});

signalService.signalServiceEvent.on('signalInfos', function (val) {
    io.sockets.emit('signalInfos', val)
});

persistanceService.persistenceEvent.on('signalsCategories', function (signalsCategories) {
    io.sockets.emit('signalsCategories', signalsCategories);
});

persistanceService.persistenceEvent.on('signalsUnity', function (signalsUnity) {
    io.sockets.emit('signalsUnity', signalsUnity);
});

persistanceService.persistenceEvent.on('recordingDates', function (dates) {
    io.sockets.emit('recordingDates', dates);
});


io.on('connection', function (socket) {

    socket.on('createSignal', function (signalValues) {
        persistanceService.persistenceEvent.on('signalCreated', function () {
            signalService.createSignal(signalValues);
        });


        signalService.signalServiceEvent.on('errorExistingSignalId', function (message) {
            socket.emit('errorExistingSignalId', message)
        });
        persistanceService.storeSignalInformation(signalValues.signalId, signalValues.category, signalValues.valMin, signalValues.valMax);
    });

    socket.on('activateSignal', function () {
        signalService.activateSignal();
    });

    socket.on('getSignalInfos', function (signalId) {
        signalService.getSignalInformations(signalId);
    });

    socket.on('updateSignal', function (generatorInfos) {
        signalService.updateSignal(generatorInfos);
    });

    socket.on('getSignalsId', function () {
        persistanceService.getSignalsId();

    });

    socket.on('getSignalsCategories', function () {
        persistanceService.getSignalsCategories();
    });

    socket.on('getSignalsUnity', function () {
        persistanceService.getSignalUnity();
    });

    socket.on('getRecordingDates', function () {
        persistanceService.getRecordingDates();
    });

    socket.on('disconnect', function () {
        socket.removeAllListeners('createSignal');
        socket.removeAllListeners('activateSignal');
        socket.removeAllListeners('getSignalInfos');
        socket.removeAllListeners('updateSignal');
        socket.removeAllListeners('getSignalsCategories');
        socket.removeAllListeners('getSignalsUnity');
        socket.removeAllListeners('getRecordingDates');


    });
});


io.on('connection', function (socket) {
    socket.on('search', function (idN, category, unity, startDate, endDate) {
        persistanceService.getSignalValues(idN, category, unity, startDate, endDate);
        persistanceService.persistenceEvent.on('signalValueData', function (dataSearch) {
            socket.emit('SearchData', dataSearch);

            //    console.log(dataSearch);
        });

        /* database.QuerySearch(idN, category, unity, startDate, endDate);
         database.PreloadValueEvent.on('SearchData',function(dataSearch){socket.emit('SearchData', dataSearch)});
         //console.log(idN + " ; "+ category + " ; "+ unity + " ; "+ startDate + " ; "+ endDate)*/
        /*
         Nouvelle la nouvelle structure de données retournée mettre a jour le front end dans ce sens

         { idN: '1',
         Category: 'analog',
         MinValue: 1,
         MaxValue: 11,
         Unity: null,
         signalvalues:
         [ { id: 1,
         idN: '1',
         ValueRec: 5.18,
         DateRec: '2017-08-05T01:12:26.000Z' },
         { id: 2,
         idN: '1',
         ValueRec: 6.57,
         DateRec: '2017-08-05T01:12:26.000Z' },
         { id: 3,
         idN: '1',
         ValueRec: 5.19,
         DateRec: '2017-08-05T01:12:27.000Z' },
         { id: 4,
         idN: '1',
         ValueRec: 3.22,
         DateRec: '2017-08-05T01:12:27.000Z' },
         ] }

         */

    });

});
