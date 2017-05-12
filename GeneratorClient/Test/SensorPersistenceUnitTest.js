/**
 * Created by Safa on 2017-05-02.
 */
'use strict';
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var expect = require("chai").expect;

const SensorPersistence = require('../Service/SensorPersistance');
const SensorRepository = require('../Repository/SensorRepository');

var existingIds = ['s001'];
var sensor1 = {
    sensorId: 's001',
    category: 'analog',
    valMin: 5,
    valMax: 15,
    unity: 'Volt'
};
var sensor2 = {
    sensorId: 's002',
    category: 'analog',
    valMin: 3,
    valMax: 13,
    unity: 'joule'
};
var sensor3 = {
    sensorId: 's003',
    category: 'binary',
    valMin: null,
    valMax: null,
    unity: 'byte'
};
var sensorList = [sensor1, sensor2, sensor3];
var newCategory = 'binary';

describe("Sensor Persistence Unit Test", function() {
    describe("get sensors", function() {
        var getAllSensors;
        var getSensors;
        before (function() {
            getAllSensors = sinon.stub(SensorRepository, 'getAllSensor', () => {
                return sensorList;
            });
            // sensorPersistence getSensors function calls repository getAllSensor function
            // Tested in the SensorPersistence Integration Test
            getSensors = sinon.stub(SensorPersistence, 'getSensors', () => {
                return SensorRepository.getAllSensor();
            });
        });
        after(function() {
            SensorRepository.getAllSensor.restore();
            SensorPersistence.getSensors.restore();
        });
        it('Should get all sensors from the signalRepository', sinon.test(function () {
            var result = SensorPersistence.getSensors();
            var expectedResult = SensorRepository.getAllSensor();

            expect(result).to.equal(expectedResult);
        }))
    });

    describe("get new sensors", function() {
        var repoGetNewSensors;
        var persistenceGetNewSensors;
        before (function() {
            repoGetNewSensors = sinon.stub(SensorRepository, 'getNewSensors', () => {
                return [sensor2, sensor3];
            });
            // SensorPersistence getNewSensors function calls repo getNewSensors function with th same argument
            // Tested in the SensorPersistence Integration Test
            persistenceGetNewSensors = sinon.stub(SensorPersistence, 'getNewSensors', () => {
                return SensorRepository.getNewSensors(existingIds);
            });
        });
        after(function() {
            SensorRepository.getNewSensors.restore();
            SensorPersistence.getNewSensors.restore();
        });
        it('Should get all new sensors from the signalRepository', sinon.test(function () {
            var result = SensorPersistence.getNewSensors(existingIds);
            var expectedResult = SensorRepository.getNewSensors(existingIds);

            expect(result[0]).to.equal(expectedResult[0]);
            expect(result[1]).to.equal(expectedResult[1]);
        }))
    });

    describe("update sensor", function() {
        var repoUpdateSensor;
        var persistenceUpdateSensor;
        // update sensor2
        before (function() {
            repoUpdateSensor = sinon.stub(SensorRepository, 'updateSensor', () => {
                sensor2.category = newCategory;
            });
            // SensorPersistence updateSensor function calls repo updateSensor function with th same arguments
            // Tested in the SensorPersistence Integration Test
            persistenceUpdateSensor = sinon.stub(SensorPersistence, 'updateSensor', () => {
                return SensorRepository.updateSensor(sensor2.sensorId, newCategory);
            });
        });
        after(function() {
            SensorRepository.updateSensor.restore();
            SensorPersistence.updateSensor.restore();
        });
        it('Should update the category of the specific sensor', sinon.test(function () {
            SensorPersistence.updateSensor(sensor2.sensorId, newCategory);

            expect(sensor2.category).to.equal(newCategory);
        }))
    });
});

