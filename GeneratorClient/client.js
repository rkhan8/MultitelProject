var socket = require('socket.io-client')('http://localhost:3000');
var signalService = require('./Service/SignalService')
var persistanceService = require('./Service/CapteurPersistance')


signalService.activateGenerators();
persistanceService.persistanceEvent.on('capteurs',function( capteurs){
    
    signalService.createSignals(capteurs);
});

signalService.signalServiceEvent.on('newValueHasGenerate', function (val) {
   // persistanceService.saveSignalValue(val.signalId, val.value);
    console.log(val);
    socket.emit('newValueFromSignal', val);
});


socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});



interval = setInterval(function () {
    persistanceService.getCapteurs(signalService.getSignalsIdList());
}, 1000);