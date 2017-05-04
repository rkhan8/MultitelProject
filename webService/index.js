var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var persistanceService = require('./backend/Service/PersistenceService')
var events = require('events');



//initialize the repository. Start the localhost server with index.html file
app.use(express.static(__dirname + '/frontend/'));

//listening the node server on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});



persistanceService.persistenceEvent.on('signalsId', function (signalsId) {
    io.sockets.emit('signalsId', signalsId);
});

persistanceService.persistenceEvent.on('signalCreateError', function (signalId) {
    io.sockets.emit('errorExistingSignalId', {
        signalId: signalId,
        message: 'Ce signal existe deja dans la base de donnée'
    });
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

persistanceService.persistenceEvent.on('signalValueData', function (dataSearch) {
    io.sockets.emit('signalsValues', dataSearch);
});


persistanceService.persistenceEvent.on('batimentAjouterOk', function () {
    io.sockets.emit('batimentAjouterOk');
});
persistanceService.persistenceEvent.on('compagnies', function (data) {
    io.sockets.emit('compagnie', data);
});
persistanceService.persistenceEvent.on('batimentsName', function (data) {
    io.sockets.emit('batimentsName', data);
})
persistanceService.persistenceEvent.on('batimentInfos', function (data) {
    io.sockets.emit('batimentsInfos', data);
});
persistanceService.persistenceEvent.on('notDisplayedSignals', function (data) {
    io.sockets.emit('notDisplayedSignals', data);
});
persistanceService.persistenceEvent.on('displayedSignals', function (data) {
    io.sockets.emit('displayedSignals', data);
});
persistanceService.persistenceEvent.on('signalStatusUpdated', function () {
    io.sockets.emit('signalRemovedFromDisplay');
});
persistanceService.persistenceEvent.on('signalUpdated', function(signalInfos){
 //   signalService.updateSignal(signalInfos);
    io.sockets.emit('signalUpdated');
});
persistanceService.persistenceEvent.on('batimentSignalInformations', function(data){
    io.sockets.emit('batimentSignalInformations', data)
});
persistanceService.persistenceEvent.on('batimentUpdated',function(){
    io.sockets.emit('batimentUpdated');
});



var clientSensor = io.of('/clientSensor');

clientSensor.on('connect', function(socket){

    socket.on('sensors', function(sensors){
        sensors.forEach(function(sensor){
            persistanceService.storeSignalInformation(sensor.idSensor,sensor.categorie);

        });
    });

    socket.on('newValueFromSensor', function(newValue){
        persistanceService.saveSignalValue(newValue.signalId, newValue.value);
        io.sockets.emit('newValue', newValue);
    });
})

io.on('connection', function (socket) {


    socket.on('addsignalOnPlayingList', function (signalInfos) {
        persistanceService.makeSignalDisplayable(signalInfos.signalId, signalInfos.compagnie, signalInfos.nomBatiment, signalInfos.numeroEtage, signalInfos.unity,signalInfos.category)
    });

    socket.on('getAllDisplayedSignals', function (view) {
        persistanceService.getDisplaySignalSignal(view);
    });
    socket.on('removeSignalFromDisplay', function (signalId) {
        persistanceService.removeSignalFromDisplay(signalId);
    });

    socket.on('deletesignalPosition', function (signalInfos) {
        persistanceService.deleteSignalPosition(signalInfos.signalId, signalInfos.view)
    });
    socket.on('updateSignalPosition', function (signalPosition) {
        persistanceService.updateSignalPosition(signalPosition.signalId, signalPosition.positionLeft, signalPosition.positionTop,signalPosition.view)
    });
    socket.on('createSignalPosition', function(signalPosition){
      persistanceService.createSignalPosition(signalPosition.signalId, signalPosition.positionLeft, signalPosition.positionTop,signalPosition.view);
    })


    socket.on('getSignalInfos', function (signalId) {
      //  persistanceService.getSignals(signalInfos.signalId, signalInfos.category,signalInfos.unity );
        persistanceService.getSignalInfos(signalId);
    });

    socket.on('updateSignalInformations', function (signalInfos) {
        clientSensor.emit('updateSensor',{
            sensorId : signalInfos.signalId,
            categorie : signalInfos.category
        })
        persistanceService.updateSignalInformations(signalInfos.signalId, signalInfos.compagnie, signalInfos.nomBatiment, signalInfos.numeroEtage, signalInfos.unity,signalInfos.category,signalInfos.oldSignalId);
    });

    socket.on('getSignalsId', function () {
        persistanceService.getSignalsId();
    });
    socket.on('getSignalsCategories', function () {
        persistanceService.getSignalsCategories();
    });

    socket.on('getSignalsUnity', function () {
        persistanceService.getSignalsUnity();
    });

    socket.on('getRecordingDates', function () {
        persistanceService.getRecordingDates();
    });

    socket.on('searchSignalsValues', function (idN, category, unity, startDate, endDate) {
        persistanceService.getSignalsValues(idN, category, unity, startDate, endDate);
    });

    socket.on('ajouterBatiment', function (batiment) {
        persistanceService.ajouterBatiment(batiment.compagnie, batiment.nomBatiment, batiment.nbEtages, batiment.adresse, batiment.codePostal, batiment.numero);
    });
    socket.on('getComapgniesName', function () {
        persistanceService.getCompagnies();
    });
    socket.on('getCompagnieBatiment', function (compagnie) {
        persistanceService.getCompagnieBatimentsName(compagnie)
    });
    socket.on('searchBatimentsValues', function (searchKey) {
        persistanceService.getBatimentsInformations(searchKey.compagnie, searchKey.NomBatiment);
    });
    socket.on('getNotDisplayedSignalsId', function () {
        persistanceService.getNotDiplayedSignalsId();
    });
    socket.on('findSignalsBySelectOption', function(batimentInfos){
        persistanceService.getBatimentSignalsInformations(batimentInfos.compagnie,batimentInfos.nomBatiment, batimentInfos.numeroEtage)
    });
    socket.on('updateBatimentInfos', function(batimentInfos){
        persistanceService.updateBatimentInformations(batimentInfos.batimentId,batimentInfos.compagnie, batimentInfos.nomBatiment, batimentInfos.nombreEtages, batimentInfos.adresse, batimentInfos.codePostal, batimentInfos.Numero)
    });
    socket.on('deleteBatiment', function(batimentId){
        persistanceService.deleteBatiment(batimentId)
    })


    socket.on('disconnect', function () {
        socket.removeAllListeners('getSignalInfos');
        socket.removeAllListeners('updateSignalInformations');
        socket.removeAllListeners('getSignalsCategories');
        socket.removeAllListeners('getSignalsUnity');
        socket.removeAllListeners('getRecordingDates');
        socket.removeAllListeners('ajouterBatiment');
        socket.removeAllListeners('getComapgniesName');
        socket.removeAllListeners('getCompagnieBatiment');
        socket.removeAllListeners('searchBatimentsValues');
        socket.removeAllListeners('createSignalPosition');
        socket.removeAllListeners('addsignalOnPlayingList');
        socket.removeAllListeners('findSignalsBySelectOption');
        socket.removeAllListeners('updateBatimentInfos');
        socket.removeAllListeners('deleteBatiment');
    });
});

initialise();
function initialise() {
    persistanceService.getSignals();
 // signalService.activateGenerators();

}
