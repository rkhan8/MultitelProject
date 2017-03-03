/**
 * Created by angem on 2017-03-03.
 */

var expect    = require("chai").expect;
var Signal = require('../backend/Model/Signal');
var max = 100;
var min = 1;
var variance =  5;

describe("Signal Test", function() {
    describe("Signal object constructor", function() {
        it("Create an signal with min and max range value", function() {

            var signal = new Signal(min, max, variance)
            expect(signal.min).to.equal(min);
            expect(signal.max).to.equal(max);
            expect(signal.variance).to.equal(variance);

        });
    });

    describe("Generate random value", function() {
        it("Random value should return a number", function() {
            var signal = new Signal(min, max, variance)

            signal.on('newValueHasGenerate',function(value){
                expect(value).to.be.a('number');
            });
            signal.generateUniformValue();


        });

        it("Difference between to consecutive should less than 2*variance ", function() {
            var signal = new Signal(min, max, variance)
            var result1;
            var result2;

            signal.on('newValueHasGenerate',function(value){
                if(result1 == undefined){
                    result1 = value;
                }
                result2 = value;
                expect(Math.abs(result1 - result2)).to.be.below(2* variance);
            });
            signal.generateUniformValue();
            signal.generateUniformValue();

        });
    });

});