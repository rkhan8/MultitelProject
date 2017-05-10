/**
 * Created by Safa on 2017-05-01.
 */
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var EventEmitter = require('events').EventEmitter;
var persistenceEvent = new EventEmitter();

var SensorPersistence = require('../Service/SensorPersistance');
var SensorRepository = require('../Repository/SensorRepository');
var existingSignalsId = ['sensor1', 'sensor2'];
var idTest = 'testSensor1';
var categoryTest = 'analog';

describe("Sensor Persistence Integration Test", function() {
    describe("get new sensors", function () {
        it("Should call signalRepository getNewSensors function with the same argument", sinon.test(function () {
            var getNewSensorsSpy = this.spy(SensorRepository, 'getNewSensors');

            SensorPersistence.getNewSensors(existingSignalsId);

            sinon.assert.calledWith(getNewSensorsSpy, existingSignalsId);
        }));
    });

    describe("update sensor", function() {
       it("Should call signalRepository updateSensor function with the same argument", sinon.test(function() {
           var updateSensorSpy = this.spy(SensorRepository, 'updateSensor');

           SensorPersistence.updateSensor(idTest, categoryTest);

           sinon.assert.calledWith(updateSensorSpy, idTest, categoryTest);
       }))
    });

    describe("get sensors", function () {
        it("Should call signalRepository getAllSensors function", sinon.test(function () {
            var getAllSensorSpy = this.spy(SensorRepository, 'getAllSensor');

            SensorPersistence.getSensors();

            sinon.assert.called(getAllSensorSpy);
        }));
    });


    describe('event on new sensors', function() {
        it('Should emit newSensors Event', sinon.test(function () {
            var newSensorsSpy = this.spy();

            persistenceEvent.on('newSensors', newSensorsSpy);
            persistenceEvent.emit('newSensors');

            sinon.assert.called(newSensorsSpy);
        }));
    });

    describe("event on sensors", function() {
        it("Should emit sensors Event", sinon.test(function() {
            var sensorsSpy = this.spy();

            persistenceEvent.on('sensors', sensorsSpy);
            persistenceEvent.emit('sensors');

            sinon.assert.called(sensorsSpy);
        }))
    })
});