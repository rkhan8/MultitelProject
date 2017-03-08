/**
 * Created by angem on 2017-03-03.
 */

var expect    = require("chai").expect;
var Signal = require('../backend/Model/Signal');
var max = 100;
var min = 1;
var variance =  5;
var generatorId = 1;

describe("Signal Test", function() {
    describe("Signal object constructor", function() {
        it("Create an signal with min and max range value", function() {

            var signal = new Signal(generatorId,min, max, variance);
            expect(signal.generatorId).to.equal(generatorId);
            expect(signal.min).to.equal(min);
            expect(signal.max).to.equal(max);
            expect(signal.variance).to.equal(variance);

        });
    });

    describe("Generate random value", function() {
        it("Random value should return a number", function() {
            var signal = new Signal(generatorId,min, max, variance)
            var value = signal.generateUniformValue();
            expect(value.generatorId).to.be.a('number');




        });

        it("Difference between to consecutive should less than 2*variance ", function() {
            var signal = new Signal(generatorId,min, max, variance)

            var result1 = signal.generateUniformValue();
            var result2 = signal.generateUniformValue();

            expect(Math.abs(result1.value - result2.value)).to.be.below(2* variance);


            signal.generateUniformValue();
            signal.generateUniformValue();

        });
    });
    describe("Binary Generator", function() {
        it("Binary should return opposite binary value", function() {
            var signal = new Signal(min, max, variance)
            var result1;
            var result2;
            signal.on('newValueHasGenerate',function(value){
                if(result1 == undefined){
                    result1 = value;
                    expect(result1).to.be.equal(0);
                }
                else{
                    result2 = value;
                    expect(result2).to.be.equal(1);
                }
            });
            signal.generateBinaryValue();
            signal.generateBinaryValue();

        });

    });

});