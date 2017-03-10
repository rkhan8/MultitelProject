/**
 * Created by angem on 2017-03-03.
 */

var expect    = require("chai").expect;
var Signal = require('../backend/Model/Signal');
var max = 100;
var min = 1;
var category = "real";
var generatorId = 1;

describe("Signal Test", function() {
    describe("Signal object constructor", function() {
        it("Create an signal with min and max range value", function() {

            var signal = new Signal(generatorId,category,min, max);
            expect(signal.getGeneratorID()).to.equal(generatorId);
            expect(signal.getMin()).to.equal(min);
            expect(signal.getMax()).to.equal(max);
            expect(signal.getCategory()).to.equal(category);

        });
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