/**
 * Created by angem on 2017-03-08.
 */
var expect    = require("chai").expect;
var signalService = require('../backend/Service/SignalService');
var sinon = require('sinon');
var assert = require("chai").assert;

var max = 100;
var min = 1;
var signalId = 1;
var value = {
    signalId: signalId,
    valMin: min,
    valMax: max
};

var value1 = {
    signalId:2,
    valMin: min,
    valMax: max
};
var value2 = {
    signalId:3,
    valMin: min,
    valMax: max
};

describe("Signal Service", function() {


    describe("Create Signals", function() {
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
        it("Add two signals with the same id is prohibited ", function(){

            var spy = sinon.spy();
            signalService.signalServiceEvent.on('errorExistingSignalId', spy);

            signalService.createSignal(value);
            signalService.createSignal(value);
            assert(spy.calledOnce);

        });


    });

    describe("Check signal integrity after adding to list of signal ", function() {
        it("Signal is consistant after adding to list of Signal", function() {
            signalService.signals.clear();
            signalService.createSignal(value);
            var signal = signalService.signals.get(0);
            expect(signal.getSignalID()).to.equal(signalId);
            expect(signal.getMin()).to.equal(min);
            expect(signal.getMax()).to.equal(max);
            signalService.signals.clear();

        });

    });

});