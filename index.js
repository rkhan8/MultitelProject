var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var signalService = require('./backend/Service/SignalService')
var persistanceService = require('./backend/Service/PersistenceService')
var events = require('events');
var dateFormat = require('dateformat');

//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname + '/frontend/'));

//listening the node server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
})

//createSignal
io.on('connection', function (socket) {
    socket.on('createSignal', function (signalValues) {
        persistanceService.persistenceEvent.on('signalCreated', function () {
            signalService.createSignal(signalValues);
        });
        persistanceService.persistenceEvent.on('signalCreateError', function (signalId) {
            socket.emit('errorExistingSignalId', {
                signalId: signalId,
                message: 'Ce signal existe deja dans la base de donnée'
            })
        });

        signalService.signalServiceEvent.on('errorExistingSignalId', function (message) {
            socket.emit('errorExistingSignalId', message)
        });
        persistanceService.storeSignalInformation(signalValues.signalId, signalValues.category, signalValues.valMin, signalValues.valMax);
    });
});

//activateSignal
io.on('connection', function (socket) {
    socket.on('activateSignal', function () {

        signalService.signalServiceEvent.on('newValueHasGenerate', function (val) {
            persistanceService.saveSignalValue(val.generatorId, val.value);
            socket.emit('newValue', val);
        });
        signalService.activateSignal();
    });

});

io.on('connection', function (socket) {
    socket.on('getSignalInfos', function (signalId) {

        signalService.signalServiceEvent.on('signalInfos', function (val) {
            socket.emit('signalInfos', val)
        });
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


        persistanceService.persistenceEvent.on('signalsData', function(data){
            socket.emit('PreDonnee', data);
            /* structure de la data
             [ { idN: '1',
             Category: 'analog',
             MinValue: 1,
             MaxValue: 11,
             Unity: null },
             { idN: '2',
             Category: 'analog',
             MinValue: 1,
             MaxValue: 11,
             Unity: null }
             ,{ idN: '3',
             Category: 'analog',
             MinValue: 1,
             MaxValue: 11,
             Unity: null }]
             */
        });
        persistanceService.persistenceEvent.on('recordingDate', function (data) {
            socket.emit('PreDonnee2', data);
            /*
            structure de data
             [ { DateRec: '2017-08-05T01:12:26.000Z' },
             { DateRec: '2017-08-05T01:12:27.000Z' },
             { DateRec: '2017-08-05T01:12:28.000Z' },
             { DateRec: '2017-08-05T01:12:29.000Z' },
             { DateRec: '2017-08-05T01:12:30.000Z' },
             { DateRec: '2017-08-05T01:12:31.000Z' },
             { DateRec: '2017-08-05T01:12:32.000Z' },
             { DateRec: '2017-08-05T01:12:33.000Z' },
             { DateRec: '2017-08-05T01:12:34.000Z' },
             { DateRec: '2017-08-05T01:12:35.000Z' } ]

             */
        });
        persistanceService.getListOfRecordingDate();
        persistanceService.getSignalFromDB();
        /* database.queryLoad();
         database.PreloadValueEvent.on('LoadFirstData',function(data){socket.emit('PreDonnee', data)});
         database.PreloadValueEvent.on('LoadSecondData',function(data2){socket.emit('PreDonnee2', data2)});*/
    });

});


io.on('connection', function (socket) {
    socket.on('search', function (idN, category, unity, startDate, endDate) {
        persistanceService.getSignalValues(1, 'analog', unity, startDate, endDate);
        persistanceService.persistenceEvent.on('signalValueData', function (dataSearch) {
            socket.emit('SearchData', dataSearch);
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
