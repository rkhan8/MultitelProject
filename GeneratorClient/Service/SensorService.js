/**
 * Created by angem on 2017-02-18.
 */
var ArrayList = require('arraylist');
var Sensor = require('../DomaineModel/Sensor');

var EventEmitter = require('events').EventEmitter;
var sensors = new ArrayList;
var sensorsId = new ArrayList;
var signalServiceEvent = new EventEmitter();
signalServiceEvent.setMaxListeners(0);
var interval;

exports.createSensor = function (sensorInfos) {
    var index = searchSensorById(sensorInfos.sensorId);
    if (index === -1) {
        var signal = new Sensor(sensorInfos.sensorId, sensorInfos.category, sensorInfos.valMin, sensorInfos.valMax, sensorInfos.unity);
        sensors.add(signal);
        sensorsId.add(sensorInfos.sensorId);
    }
    else {
        signalServiceEvent.emit('errorExistingSignalId', 'Ce generateur existe deja. Choisissez un autre nom de generateur');
    }
};

exports.createSensors = function (sensorInfos) {
    sensorInfos.forEach(function (sensor) {
        sensors.add(new Sensor(sensor.idSensor, sensor.categorie, sensor.valeurMax, sensor.valeurMin));
        sensorsId.add(sensor.idSensor);
    });
};

exports.getSensors = function () {
    return JSON.parse(JSON.stringify(sensors));
};

exports.updateSensor = function (sensorInfos) {
    var index = searchSensorById(sensorInfos.oldSignalId);
    if (index != -1) {
        sensors.get(index).updateSensor(sensorInfos.idSensor, sensorInfos.categorie, sensorInfos.unity);
    }
    else {
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouvé');
    }
};

function searchSensorById(signalId) {
    for (i = 0; i < sensors.length; i++) {
        if (signalId === sensors.get(i).getSignalID())
            return i;
    }
    return -1;
}

exports.activateGenerators = function () {
    clearInterval(interval);
    interval = setInterval(function () {
        for (i = 0; i < sensors.length; i++) {
            var values = sensors.get(i).nextValue();
            signalServiceEvent.emit('newValueHasGenerate', values);
        }

    }, 500);

};

exports.getSensorsIdList = function(){
    return sensorsId;
};

exports.getSensorInformations = function (signalId) {
    var index = searchSensorById(signalId);
    if (index != -1) {
        var infos = sensors.get(index).getSensorInformations();
        signalServiceEvent.emit('signalInfos', infos);
        return infos;
    }
    else {
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouver');
    }

};

exports.deleteSensor = function(sensorId) {
  var index = searchSensorById(sensorId);
    if(index !== -1) {
        sensors.toArray().splice(index, 1);
        sensorsId.toArray().splice(index, 1);
        sensors.length -= 1;
        sensorsId.length -= 1;
    }
    else {
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouvé');
    }
};

exports.deleteAllSensors = function() {
    sensors = new ArrayList;
    sensorsId = new ArrayList;
    sensors.length = 0;
    sensorsId.length = 0;
};

exports.sensorServiceEvent = signalServiceEvent;

