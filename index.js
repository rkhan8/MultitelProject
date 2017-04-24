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

signalService.signalServiceEvent.on('errorExistingSignalId', function (message) {
    socket.emit('errorExistingSignalId', message)
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

persistanceService.persistenceEvent.on('signalValueData', function (dataSearch) {
    io.sockets.emit('signalsValues', dataSearch);
});

persistanceService.persistenceEvent.on('signalCreated', function (signalInfos) {
    signalService.createSignal(signalInfos);
});

persistanceService.persistenceEvent.once('signalsData', function (signals) {
    signalService.createSignals(signals);
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
    signalService.updateSignal(signalInfos);
    io.sockets.emit('signalUpdated');
})


io.on('connection', function (socket) {

    socket.on('addsignalOnPlayingList', function (signalInfos) {
        // persistanceService.storeSignalInformation(signalInfos.signalId, signalInfos.category, signalInfos.valMin, signalInfos.valMax, signalInfos.unity);
        persistanceService.makeSignalDisplayable(signalInfos.signalId, signalInfos.compagnie, signalInfos.nomBatiment, signalInfos.numeroEtage, signalInfos.unity,signalInfos.category)
    });

    /* socket.on('getAllSignals', function(){
     socket.emit('signals',signalService.getSignals());
     });*/
    socket.on('getAllDisplayedSignals', function () {
        persistanceService.getDisplaySignalSignal();
    });
    socket.on('removeSignalFromDisplay', function (signalId) {
        persistanceService.removeSignalFromDisplay(signalId);
    });
    socket.on('addSignalOnDisplay', function (signalId) {
        persistanceService.addSignalOnDisplay(signalId)
    });
    socket.on('deletesignalPosition', function (signalId) {
        persistanceService.deleteSignalPosition(signalId)
    });
    socket.on('updateSignalPosition', function (signalPosition) {
        persistanceService.updateSignalPosition(signalPosition.signalId, signalPosition.positionLeft, signalPosition.positionTop,signalPosition.view)
    });
    socket.on('createSignalPosition', function(signalPosition){
      persistanceService.createSignalPosition(signalPosition.signalId, signalPosition.positionLeft, signalPosition.positionTop,signalPosition.view);
    })

   /* socket.on('activateGenerators', function () {
        signalService.activateGenerators();
    });*/

    socket.on('getSignalInfos', function (signalId) {
        signalService.getSignalInformations(signalId);
    });

    socket.on('updateSignalInformations', function (signalInfos) {
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

    socket.on('disconnect', function () {
        socket.removeAllListeners('createSignal');
        socket.removeAllListeners('activateGenerators');
        socket.removeAllListeners('getSignalInfos');
        socket.removeAllListeners('updateSignalInformations');
        socket.removeAllListeners('getSignalsCategories');
        socket.removeAllListeners('getSignalsUnity');
        socket.removeAllListeners('getRecordingDates');
        socket.removeAllListeners('ajouterBatiment');
        socket.removeAllListeners('getComapgniesName');
        socket.removeAllListeners('getCompagnieBatiment');
        socket.removeAllListeners('searchBatimentsValues');


    });
});

initialise();
function initialise() {
    persistanceService.getSignals();
  signalService.activateGenerators();

}
