/**
 * Created by Safa on 2017-05-08.
 */
"use strict";

var SensorService = require('../Service/SensorService');
var Sensor = require('../DomaineModel/Sensor');

var expect = require("chai").expect;

var sensorInfo = {
    sensorId: 'sensTest001',
    category: 'analog',
    valMin: 5,
    valMax: 15,
    unity: 'Volt'
};
var sensorInfo2 = {
    sensorId: 'sensTest002',
    category: 'analog',
    valMin: 3,
    valMax: 13,
    unity: 'joule'
};
var sensorsToCreate = [sensorInfo, sensorInfo2];
var newId = "newSensorId";
var newCategory = "binary";
var newUnity = "Kelvin";

describe("Sensor Service Unit Test", function() {
    describe("Create sensor", function() {
        it("Should create sensor with correct attributes", function() {
            SensorService.createSensor(sensorInfo);

            var sensorList = SensorService.getSensors();
            var newSensor = sensorList[0];

            expect(newSensor._sensorId).to.equal(sensorInfo.sensorId);
            expect(newSensor._category).to.equal(sensorInfo.category);
            expect(newSensor._unity).to.equal(sensorInfo.unity);
            expect(newSensor._min).to.equal(sensorInfo.valMin);
            expect(newSensor._max).to.equal(sensorInfo.valMax);
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

});