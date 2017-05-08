/**
 * Created by Safa on 2017-05-02.
 */
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var expect = require("chai").expect;
var SequelizeMock = require('sequelize-mock');

var sensorPersistence = require('../Service/SensorPersistance');
var sensorRepository = require('../Repository/SensorRepository');

var repositoryMock = sinon.mock(sensorRepository);

var newId = 'newSensId';
var newCategory = 'binary';
var existingIds = ["sens1", "sens2"];

var MySQLConnectionMock = new SequelizeMock('multitel', 'multitel', 'multitel', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

// modèle ne sert pas au test
var SensorMock1 = MySQLConnectionMock.define('sensorModel1', {
    sensorId: 'testSens01',
    category: 'analog',
    min: 1,
    max: 11,
    unity: 'joule'
});


describe("Sensor Persistence Unit Test", function() {
    describe("get sensors", function() {
        it('Should get all sensors from the repository', sinon.test(function () {

            var result = sensorPersistence.getSensors();
            var expectedResult = repositoryMock.getAllSensor();

            expect(result.length).to.equal(expectedResult.length);
            for(var i =0; i < result.length; i++ ) {
                expect(result[i]).equal.to(expectedResult[i]);
            }
        }))
    });

    describe("get new sensors", function(){
        it("Should get all the new sensors from the repository", sinon.test(function() {
            var result = sensorPersistence.getNewSensors(existingIds);
            var expectedResult = repositoryMock.getNewSensors(existingIds);

            expect(result.length).to.equal(expectedResult.length);
            for(var i =0; i < result.length; i++ ) {
                expect(result[i]).equal.to(expectedResult[i]);
            }
        }));
        it("Should not select the new sensor ids", sinon.test(function() {
            var result = sensorPersistence.getNewSensors(existingIds);

            for(var i =0; i < result.length; i++ ) {
                expect(result[i].getSignalID()).not.equal.to(existingIds[0]);
                expect(result[i].getSignalID()).not.equal.to(existingIds[1]);
            }
        }))
    });

    describe("update sensor" , function () {
        it("Should update sensor in the repository with correct values", sinon.test(function() {
            var firstSensor = sensorPersistence.getSensors()[0];
            firstSensor.updateSensor(newId, newCategory);

            expect(firstSensor.getSignalID()).to.equal(newId);
            expect(firstSensor.getCategory()).to.equal(newCategory);
            /*SensorMock1.update({
                category: 'binary',
                unity: 'volt'
            })
                .then(function(updatedSensor) {
                    expect(updatedSensor.category).to.equal('binary')
                })*/
        }))
    })
});

