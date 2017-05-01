/**
 * Created by angem on 2017-04-28.
 */
var sensorRepository  = require('../Repository/SensorRepository');
var EventEmitter = require('events').EventEmitter;
var persistanceEvent = new EventEmitter();


exports.getNewSensors = function(extingSignalsId){
    sensorRepository.getNewSensors(extingSignalsId);
}
exports.updateSensor = function (sensorId, category){
    sensorRepository.updateSensor(sensorId, category)
}
exports.getSensors = function(){
    sensorRepository.getAllSensor()
}

sensorRepository.sensorRepositoryEvent.on('newSensors', function(newSensors){
    persistanceEvent.emit('newSensors', newSensors)
});
sensorRepository.sensorRepositoryEvent.on('getNewSensorError', function(message){
    persistanceEvent.emit('error',message);
});

sensorRepository.sensorRepositoryEvent.on('sensors', function(sensors){
    persistanceEvent.emit('sensors', sensors)
});
sensorRepository.sensorRepositoryEvent.on('getSensorError', function(message){
    persistanceEvent.emit('error',message);
});

exports.persistanceEvent = persistanceEvent;

