/**
 * Created by Safa on 2017-05-01.
 */
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var EventEmitter = require('events').EventEmitter;
var persistanceEvent = new EventEmitter();

var SensorPersistance = require('../Service/SensorPersistance');
var SensorRepository = require('../Repository/SensorRepository');
var existingSignalsId = ['sensor1', 'sensor2'];
var idTest = 'testSensor1';
var categoryTest = 'analog';

describe("Sensor Persistance Test", function() {
    describe("get new sensors", function () {
        it("Should call repository getNewSensors function with the same argument", sinon.test(function () {
            var getNewSensorsSpy = this.spy(SensorRepository, 'getNewSensors');

            SensorPersistance.getNewSensors(existingSignalsId);

            sinon.assert.calledWith(getNewSensorsSpy, existingSignalsId);
        }));
    });

    describe("update sensor", function() {
       it("Should call repository updateSensor function with the same argument", sinon.test(function() {
           var updateSensorSpy = this.spy(SensorRepository, 'updateSensor');

           SensorPersistance.updateSensor(idTest, categoryTest);

           sinon.assert.calledWith(updateSensorSpy, idTest, categoryTest);
       }))
    });

    describe("get sensors", function () {
        it("Should call repository getAllSensors function", sinon.test(function () {
            var getAllSensorSpy = this.spy(SensorRepository, 'getAllSensor');

            SensorPersistance.getSensors();

            sinon.assert.called(getAllSensorSpy);
        }));
    });


    describe('event on new sensors', function() {
        it('Should emit newSensors Event', sinon.test(function () {
            var newSensorsSpy = this.spy();

            persistanceEvent.on('newSensors', newSensorsSpy);
            persistanceEvent.emit('newSensors');

            sinon.assert.called(newSensorsSpy);
        }));
    });

    describe("event on sensors", function() {
        it("Should emit sensors Event", sinon.test(function() {
            var sensorsSpy = this.spy();

            persistanceEvent.on('sensors', sensorsSpy);
            persistanceEvent.emit('sensors');

            sinon.assert.called(sensorsSpy);
        }))
    })
});