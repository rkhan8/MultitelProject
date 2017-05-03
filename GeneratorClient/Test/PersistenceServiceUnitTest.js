/**
 * Created by Safa on 2017-05-02.
 */

var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var expect = require("chai").expect;

var sensorPersistence = require('../Service/SensorPersistance');
var sensorRepository = require('../Repository/SensorRepository');
var sensor = require('../Repository/Model/sensor');

var SequelizeMock = require('sequelize-mock');
var mySqlConnectionMock = new SequelizeMock();
var sensorModelMock = mySqlConnectionMock.define('model', sensor);
sensorModelMock.sync();

describe("Sensor Persistence Unit Test", function() {
    describe("get sensors", function() {
        it('Should get all sensors from the repository', sinon.test(function() {
            var repositoryMock = this.mock(sensorRepository);
            repositoryMock.expects('getAllSensor').calledOnce;

            var expectedList = sensorModelMock.findAll();
            var list = sensorPersistence.getSensors();

            repositoryMock.verify();
            //expect(list).to.equal(expectedList);
        }))
    });

});

