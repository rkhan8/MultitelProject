/**
 * Created by angem on 2017-03-03.
 */

var expect    = require("chai").expect;
var Signal = require('../backend/DomaineModel/Signal');
var max = 10;
var min = 1;
var category = "analog";
var generatorId = 1;

describe("Signal Test", function() {
    describe("object constructor", function() {
        it("Create an signal with min and max range value", function() {

            var signal = new Signal(generatorId,category,min, max);
            expect(signal.getGeneratorID()).to.equal(generatorId);
            expect(signal.getMin()).to.equal(min);
            expect(signal.getMax()).to.equal(max);
            expect(signal.getCategory()).to.equal(category);

        });
    });
    describe("Update signal", function(){
        it("Update signal value should update value", function(){
            var signal = new Signal(generatorId,category,min, max);
            var max1 = 50;
            var min1 = 35;
            var category1 = "binary";
            var generatorId1 = 2;

            signal.updateSignal(generatorId1,category1,min1, max1);
            expect(signal.getGeneratorID()).to.equal(generatorId1);
            expect(signal.getMin()).to.equal(min1);
            expect(signal.getMax()).to.equal(max1);
            expect(signal.getCategory()).to.equal(category1);

        });
        it("Change signal range should change range value", function(){
            var signal = new Signal(generatorId,category,min, max);
            var result1 = signal.generateValue();
            console.log(result1);
            expect(result1.value).to.be.within(min, max);

            var max1 = 50;
            var min1 = 35;
            var category1 = "analog";
            var generatorId1 = 2;
            signal.updateSignal(generatorId1,category1,min1, max1);
            var result1 = signal.generateValue();

            expect(result1.value).to.be.within(min1, max1);

        })
        it("Change signal category should change signal generator function", function(){
            var signal = new Signal(generatorId,category,min, max);
            var result1 = signal.generateValue();
            expect(result1.value).to.be.within(min, max);


            var category1 = "binary";
            var generatorId1 = 2;
            signal.updateSignal(generatorId1,category1);
             result1 = signal.generateValue();
            var result2 = signal.generateValue();
            expect(result1.value).to.be.equal(0);
            expect(result2.value).to.be.equal(1);

        })
    });

    describe("Generate random value", function() {
        it("Random value should return a number", function() {
            var signal = new Signal(generatorId,category,min, max);
            var result = signal.generateValue();
            expect(result.value).to.be.a('number');

        });

        it("Random value should return value in range", function() {
            var signal = new Signal(generatorId,category,min, max);
            var result1 = signal.generateValue();
            expect(result1.value).to.be.within(min, max);
        });

        it("Signal should generate multiple value in range", function(){
            var signal = new Signal(generatorId,category,min, max);
            for(i= 0; i<100 ; i++){
                var result1 = signal.generateValue();
                expect(result1.value).to.be.within(min, max);
            }
        });
    });
    describe("Binary Generator", function() {
        it("Binary should return opposite binary value", function() {
            var category = "binary"
            var signal = new Signal(generatorId,category,min, max);
            var result1 = signal.generateValue();
            var result2 = signal.generateValue();
            expect(result1.value).to.be.equal(0);
            expect(result2.value).to.be.equal(1);

        });

    });

});