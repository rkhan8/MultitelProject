/**
 * Created by Safa on 2017-05-10.
 */
'use strict';
var expect = require("chai").expect;
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
var EventEmitter = require('events').EventEmitter;


var persistenceService = require('../backend/Service/PersistenceService.js');
var signalRepository = require('../backend/Repository/SignalRepository');
var buildingRepository = require('../backend/Repository/BatimentRepository');

var signalIdTest = "signalIdTest55";
var categoryTest = "analog";
var valMinTest = 2;
var valMaxTest = 22.5;
var unityTest = "Joule";
var valueTest = 17.2;
var startDateTest = "2017-05-10";
var endDateTest = "2017-05-12";

describe("Persistence Service Unit Test", function() {
    describe('store Signal Information', function() {
        it('Should store correct generator information', function() {
            persistenceService.storeSignalInformation(signalIdTest, categoryTest, valMinTest, valMaxTest, unityTest);

            expect(signalRepository.signalRepositoryEvent.emit('signalCreated', {
                    signalId: signalIdTest,
                    category: categoryTest,
                    valMin: valMinTest,
                    valMax: valMaxTest
                })
            )
        })
    });
    describe('save Signal Value', function() {
        it('Should save the correct signal value', function() {
            persistenceService.saveSignalValue(signalIdTest, valueTest);

            expect(signalRepository.signalRepositoryEvent.emit('valueInserted', signalIdTest));
        })
    });
    describe('get Recording Dates', function() {
        it('should return the list of recording date', function() {
            persistenceService.getRecordingDates();

            expect(function (result) {
                signalRepository.signalRepositoryEvent.emit('signalValueRecordingDateFound', JSON.parse(JSON.stringify(result)))

            });
        })
    });
    describe('get Signals Id', function() {
        it('Should return the list of signal ids', function() {
            persistenceService.getSignalsId();

            expect(function (result) {
                signalRepository.signalRepositoryEvent.emit('signalsIdFound', JSON.parse(JSON.stringify(result)))

            });
        })
    });
    describe('get Signals Unity', function() {
        it('Should return the list of signal unities', function() {
            persistenceService.getSignalsUnity();

            expect(function (result) {
                signalRepository.signalRepositoryEvent.emit('signalsUnityFound', JSON.parse(JSON.stringify(result)))

            });
        })
    });
    describe('get Signals categories', function() {
        it('Should return the list of signal categories', function() {
            persistenceService.getSignalsCategories();

            expect(function (result) {
                signalRepository.signalRepositoryEvent.emit('signalsCategoriesFound', JSON.parse(JSON.stringify(result)))

            });
        })
    });
    describe('get Signals Values', function() {
        it('Should return the correct signal value', function() {
            persistenceService.getSignalsValues(signalIdTest, categoryTest, unityTest, startDateTest, endDateTest);

            expect(function (result) {
                signalRepository.signalRepositoryEvent.emit('signalValueFound', JSON.parse(JSON.stringify(result)))
            })

        })
    });
    describe('get Signals', function() {
        it('Should return the correct signal', function() {
            persistenceService.getSignals(signalIdTest, categoryTest, unityTest);
            //
            // expect(function (result) {
            //     signalRepository.signalRepositoryEvent.emit('signals', JSON.parse(JSON.stringify(result)))
            // })
            var spy = sinon.spy();
            var emitter = new EventEmitter;

            emitter.on('createSignalPositionError', spy);
            emitter.emit('createSignalPositionError', signalIdTest, categoryTest, unityTest);
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, signalIdTest, categoryTest, unityTest);
        })
    });
});