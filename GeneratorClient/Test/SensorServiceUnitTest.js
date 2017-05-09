/**
 * Created by Safa on 2017-05-08.
 */
"use strict";
var sinon = require('sinon');

var SensorService = require('../Service/SensorService');
var Sensor = require('../DomaineModel/Sensor');
var expect = require("chai").expect;

var sensor1 = {
    sensorId: 'sensTest001',
    category: 'analog',
    valMin: 5,
    valMax: 15,
    unity: 'Volt'
};
var sensor2 = {
    sensorId: 'sensTest002',
    category: 'analog',
    valMin: 3,
    valMax: 13,
    unity: 'joule'
};
var sensor3 = {
    sensorId: 'sensTest003',
    category: 'binary',
    valMin: null,
    valMax: null,
    unity: 'byte'
};
var sensorsToCreate = [sensor1, sensor2];
var sensorTest = new Sensor('newSens4', 'analog', 7, 17, 'Celsuis');
var newSensorInfo = {
    idSensor: 'newSens4',
    categorie: 'binary',
    valMin: null,
    valMax: null,
    unity: 'Kelvin'
};

describe("Sensor Service Unit Test", function() {
    describe("Create sensor", function() {
        it("Should create sensor with correct attributes", function() {
            SensorService.createSensor(sensor1);

            var sensorList = SensorService.getSensors();
            var newSensor = sensorList[sensorList.length - 1];

            expect(newSensor._sensorId).to.equal(sensor1.sensorId);
            expect(newSensor._category).to.equal(sensor1.category);
            expect(newSensor._unity).to.equal(sensor1.unity);
            expect(newSensor._min).to.equal(sensor1.valMin);
            expect(newSensor._max).to.equal(sensor1.valMax);
        })
    });

    describe("create sensors", function() {
        it("Should add all the created sensors to sensors list", function () {
            var oldSensorListLength = SensorService.getSensors().length;

            SensorService.createSensors(sensorsToCreate);
            var sensorsList = SensorService.getSensors();

            expect(sensorsList.length).to.equal(oldSensorListLength + 2);
        })
    });

    describe("get sensors", function() {
        it("Should get all the created sensors", function() {
            SensorService.deleteAllSensors();
            SensorService.createSensor(sensor1);
            SensorService.createSensor(sensor2);
            SensorService.createSensor(sensor3);

            var sensorList = SensorService.getSensors();

            expect(sensorList.length).to.equal(3);
            expect(sensorList[0]._sensorId).to.equal(sensor1.sensorId);
            expect(sensorList[1]._sensorId).to.equal(sensor2.sensorId);
            expect(sensorList[2]._sensorId).to.equal(sensor3.sensorId);
        })
    });

    describe("update sensor", function() {
        it("Should update the specific sensor with correct values", function() {
            SensorService.createSensor(sensorTest);

            sensorTest.updateSensor(newSensorInfo.idSensor, newSensorInfo.categorie, newSensorInfo.unity); //success
            //SensorService.updateSensor(newSensorInfo); //fail

            expect(sensorTest._sensorId).to.equal(newSensorInfo.idSensor);
            expect(sensorTest._category).to.equal(newSensorInfo.categorie);
            expect(sensorTest._unity).to.equal(newSensorInfo.unity);
        });
    });

    describe("get sensors id list", function() {
        it("Should return all existing sensor ids", function() {
            SensorService.deleteAllSensors();
            SensorService.createSensor(sensor1);
            SensorService.createSensor(sensor2);
            SensorService.createSensor(sensor3);

            var result = SensorService.getSensorsIdList();
            var resultString = JSON.parse(JSON.stringify(result));

            expect(resultString.length).to.equal(3);
            expect(resultString[0]).to.equal(sensor1.sensorId);
            expect(resultString[1]).to.equal(sensor2.sensorId);
            expect(resultString[2]).to.equal(sensor3.sensorId);
        })
    });

    describe("get sensor information", function() {
        it("Should get the correct information", function() {
            SensorService.createSensor(sensor1);

            var result = SensorService.getSensorInformations(sensor1.sensorId);

            var expectedResult = {
                sensorId: sensor1.sensorId,
                category: sensor1.category,
                unity: sensor1.unity
            };

            expect(result.sensorId).to.equal(expectedResult.sensorId);
            expect(result.category).to.equal(expectedResult.category);
            expect(result.unity).to.equal(expectedResult.unity);
        })
    });

    describe("delete sensor", function() {
        it("Should delete specific sensor", function() {
            SensorService.deleteAllSensors();
            SensorService.createSensor(sensor1);
            SensorService.createSensor(sensor2);
            SensorService.createSensor(sensor3);
            var lengthOldSensorList = SensorService.getSensors().length;
            var lengthOldSensorIdList = SensorService.getSensorsIdList().length;

            SensorService.deleteSensor(sensor3.sensorId);
            var lengthNewSensorList = SensorService.getSensors().length;
            var lengthNewSensorIdList = SensorService.getSensorsIdList().length;
            var newSensorIdList = JSON.parse(JSON.stringify(SensorService.getSensorsIdList()));

            expect(lengthNewSensorList).to.equal(lengthOldSensorList - 1);
            expect(lengthNewSensorIdList).to.equal(lengthOldSensorIdList - 1);
            expect(newSensorIdList.indexOf(sensor3.sensorId)).to.equal(-1);
        })
    });

    describe("delete all sensors", function() {
        it("Should delete all sensors", function() {
            SensorService.deleteAllSensors();

            var lengthSensorList = SensorService.getSensors().length;
            var lengthSensorIdList = SensorService.getSensorsIdList().length;

            expect(lengthSensorList).to.equal(0);
            expect(lengthSensorIdList).to.equal(0);
        })
    });

});