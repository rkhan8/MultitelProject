/**
 * Created by Safa on 2017-05-02.
 */
'use strict';
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var expect = require("chai").expect;
var SequelizeMock = require('sequelize-mock');

const SensorPersistence = require('../Service/SensorPersistance');
const SensorRepository = require('../Repository/SensorRepository');

var sensorList = ['sensor1', 'sensor2', 'sensor3', 'sensor4'];

var MySQLConnectionMock = new SequelizeMock('multitel', 'multitel', 'multitel', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});
// modèle ne sert pas au test
/*var SensorMock1 = MySQLConnectionMock.define('sensorModel1', {
    sensorId: 'testSens01',
    category: 'analog',
    min: 1,
    max: 11,
    unity: 'joule'
});*/
describe("Sensor Persistence Unit Test", function() {
    describe("get sensors", function() {
        var getAllSensors;
        var getSensors;
        before (function() {
            getAllSensors = sinon.stub(SensorRepository, 'getAllSensor', () => {
                return sensorList;
            });
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
            expect(result).to.equal(sensorList);
        }))
    });
});

