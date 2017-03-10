/**
 * Created by angem on 2017-03-08.
 */
var expect    = require("chai").expect;
var signalService = require('../backend/Routes/SignalService');

var max = 100;
var min = 1;
var generatorId = 1;
var value = {
    generatorId:generatorId,
    valMin: min,
    valMax: max
};

var value1 = {
    generatorId:2,
    valMin: min,
    valMax: max
};
var value2 = {
    generatorId:3,
    valMin: min,
    valMax: max
};

describe("Signal Service", function() {


    describe("Add signal to list of signals", function() {
        it("Add One Signal to list of Signal", function() {
            signalService.createSignal(value);
            expect(signalService.signals.length).to.equal(1);
            signalService.signals.clear();

        });

        it("Add Multiple Signals to list of Signal", function() {
            signalService.createSignal(value);
            signalService.createSignal(value1);
            signalService.createSignal(value2);
            expect(signalService.signals.length).to.equal(3);
            signalService.signals.clear();

        });
    });

    describe("Check signal integrity after adding to list of signal ", function() {
        it("Signal is consistant after adding to list of Signal", function() {
            signalService.createSignal(value);
            var signal = signalService.signals.get(0);
            expect(signal.getGeneratorID()).to.equal(generatorId);
            expect(signal.getMin()).to.equal(min);
            expect(signal.getMax()).to.equal(max);
            signalService.signals.clear();

        });

    });

});