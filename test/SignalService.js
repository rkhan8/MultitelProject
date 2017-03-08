/**
 * Created by angem on 2017-03-08.
 */
var expect    = require("chai").expect;
var signalService = require('../backend/Routes/SignalService');

var max = 100;
var min = 1;
var generatorId = 1;
var value = {
    generatorNumber:generatorId,
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
            signalService.createSignal(value);
            signalService.createSignal(value);
            expect(signalService.signals.length).to.equal(3);
            signalService.signals.clear();

        });


    });

    describe("Check signal integrity after adding to list of signal ", function() {
        it("Signal is consistant after adding to list of Signal", function() {
            signalService.createSignal(value);
            var signal = signalService.signals.get(0);
            expect(signal.generatorId).to.equal(generatorId);
            expect(signal.min).to.equal(min);
            expect(signal.max).to.equal(max);
            signalService.signals.clear();

        });

    });

});