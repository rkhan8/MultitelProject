'use strict';
var expect = require("chai").expect;

var persistenceService = require('../backend/Service/PersistenceService.js');
var repository = require('../backend/Repository/SignalRepository');

var idTest = '1';
var categoryTest = 'analog';
var minValTest = 2;
var maxValTest = 16;
var unityTest = 'volt';
var valueTest = 13.05;
var dateTest = '2017-04-10';
var endDateTest = '2017-04-12';

// tester si les informations stockées sont correctes
describe('storeSignalInformation', function() {
    it('should store correct generator informations', function() {
        persistenceService.storeSignalInformation(idTest, categoryTest, minValTest, maxValTest, unityTest);

        expect(repository.SignalRepositoryEvent.emit('signalCreated', {
            signalId: idTest,
            category: categoryTest,
            valMin: minValTest,
            valMax: maxValTest
        })
        )
    })
});

// tester si les informations d'un signal est correctement enregistré
describe('saveSignalValue', function() {
   it('should save the correct signal value', function() {
       persistenceService.saveSignalValue(idTest, valueTest, dateTest);

       expect(repository.SignalRepositoryEvent.emit('signalValueCreated', {
           signalId: idTest,
           value: valueTest,
           date: dateTest
       })
       )
   })
});

// tester si getSignalFromDB retourne les informations du générateur
describe('getSignalFromDB', function() {
   it('should get the correct generator information', function() {
       persistenceService.getSignalFromDB(idTest, categoryTest, minValTest, maxValTest, unityTest);

       expect(function (result) {
           repository.SignalRepositoryEvent.emit('signalsFounded', JSON.parse(JSON.stringify(result)))
       })
   })
});

// tester si getRecordingDates retourne la liste de dates
describe('getRecordingDates', function() {
    it('should return the list of recording date', function() {
        persistenceService.getRecordingDates();

        expect(function (result) {
            repository.SignalRepositoryEvent.emit('signalValueRecordingDateFound', JSON.parse(JSON.stringify(result)))

        });
    })
});

// tester si getSignalValues retourne les informations d'un signal
describe('getSignalValues', function() {
    it('should return the correct signal information', function() {
        persistenceService.getSignalValues(idTest, categoryTest, unityTest, dateTest, endDateTest);

        expect(function (result) {
            repository.SignalRepositoryEvent.emit('signalValueFound', JSON.parse(JSON.stringify(result)))
        })
    })
});
