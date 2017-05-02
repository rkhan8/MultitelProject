/**
 * Created by Safa on 2017-05-01.
 */
var Sensor = require('../DomaineModel/Sensor');
var expect = require("chai").expect;

var idTest = 'idTest1';
var categoryTest = 'analog';
var minTest = 2;
var maxTest = 15;
var unityTest = 'volt';
var newIdTest = 'newIdTest1';
var newCategoryTest = 'binary';
var newUnityTest = 'joule';

describe("Sensor Test", function() {
    describe("sensor constructor", function () {
        it("Should create a sensor with the correct attributes", function () {
            var sensorTest = new Sensor(idTest,categoryTest, minTest, maxTest, unityTest);

            expect(sensorTest.getSignalID()).to.equal(idTest);
            expect(sensorTest.getCategory()).to.equal(categoryTest);
            expect(sensorTest._generator.getMin()).to.equal(minTest);
            expect(sensorTest._generator.getMax()).to.equal(maxTest);
            expect(sensorTest._unity).to.equal(unityTest);
        });
    });

    describe("update sensor", function() {
        it("Should update the sensor with correct values", function() {
            var sensorTest = new Sensor(idTest,categoryTest, minTest, maxTest, unityTest);

            sensorTest.updateSensor(newIdTest, newCategoryTest, newUnityTest);

            expect(sensorTest.getSignalID()).to.equal(newIdTest);
            expect(sensorTest.getCategory()).to.equal(newCategoryTest);
            expect(sensorTest._unity).to.equal(newUnityTest);
        });
    });

    describe("next value", function() {
        it("Should return the correct nextValue and sensorId", function() {
            var sensorTest = new Sensor(idTest,categoryTest, minTest, maxTest, unityTest);

            var result = sensorTest.nextValue();

            expect(result.value).to.equal(sensorTest._generator._currentValue);
            expect(result.sensorId).to.equal(idTest);
        })
    })
});