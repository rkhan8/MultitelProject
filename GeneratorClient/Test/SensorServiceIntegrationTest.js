/**
 * Created by Safa on 2017-05-09.
 */
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var EventEmitter = require('events').EventEmitter;
var sensorServiceEvent = new EventEmitter();
var expect = require("chai").expect;

var SensorService = require('../Service/SensorService');
var Sensor = require('../DomaineModel/Sensor');
var interval;

var sensor1 = {
    sensorId: 'sensTest991',
    category: 'analog',
    valMin: 5,
    valMax: 15,
    unity: 'Volt'
};
var sensor2 = {
    sensorId: 'sensTest992',
    category: 'analog',
    valMin: 3,
    valMax: 13,
    unity: 'joule'
};
var sensor3 = {
    sensorId: 'sensTest993',
    category: 'binary',
    valMin: null,
    valMax: null,
    unity: 'byte'
};

describe("Sensor Service Integration Test", function() {
    describe("activate generators", function() {
        it("Should call Sensor nextValue function", sinon.test(function() {
            var nextValueSpy = this.spy(Sensor.prototype, 'nextValue');

            SensorService.deleteAllSensors();
            SensorService.createSensor(sensor1);
            SensorService.createSensor(sensor2);
            SensorService.createSensor(sensor3);

            SensorService.activateGenerators();

            clearInterval(interval);
            interval = setInterval(function () {
                nextValueSpy.restore();
                sinon.assert.called(nextValueSpy);
            }, 500);
        }));
        it("Should emit newValueIsGenerated Event", sinon.test(function() {
            var generatedValueSpy = this.spy();
            sensorServiceEvent.on('newValueIsGenerated', generatedValueSpy);
            sensorServiceEvent.emit('newValueIsGenerated');

            SensorService.activateGenerators();

            sinon.assert.called(generatedValueSpy);
        }))
    })
});