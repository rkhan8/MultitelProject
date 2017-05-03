var socket = require('socket.io-client')('http://localhost:3000/clientSensor');
var sensorService = require('./Service/SensorService')
var persistanceService = require('./Service/SensorPersistance')


sensorService.activateGenerators();
persistanceService.persistanceEvent.on('newSensors',function( newSensors){
    sensorService.createSensors(newSensors);
});

persistanceService.persistanceEvent.on('sensors', function(sensors){
    socket.emit('sensors',sensors);
});

sensorService.sensorServiceEvent.on('newValueHasGenerate', function (val) {
    val['signalId']= val.sensorId;
    delete val['sensorId'];
    console.log(val);
    socket.emit('newValueFromSensor', val);
});


socket.on('connect', function(){
    persistanceService.getSensors();

});
socket.on('updateSensor', function(data){
persistanceService.updateSensor(data.sensorId,data.categorie)
});
socket.on('disconnect', function(){

});



interval = setInterval(function () {
    persistanceService.getNewSensors(sensorService.getSensorsIdList());
}, 1000);