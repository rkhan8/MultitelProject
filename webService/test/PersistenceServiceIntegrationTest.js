/**
 * Created by Safa on 2017-05-09.
 */
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);

var PersistenceService = require('../backend/Service/PersistenceService');
var signalRepository = require('../backend/Repository/SignalRepository');
var buildingRepository = require('../backend/Repository/BatimentRepository');

var signalId = 'testSignal45';
var category = 'analog';
var unity = 'volt';
var value = 11.5;
var startDate = '2017-05-09';
var endDate = '2017-05-12';
var newSignalId = "newTestSignalId";

var firm = "Multitel";
var buildingName = "The tour";
var floorNumber = 3;
var address = "avenue cartier, Québec";
var zipCode = "F4k E8I";
var number = 1718;
var buildingId = "testBuilding01";

describe("Persistence Service Integration Test", function() {
    describe("store Signal Information", function() {
        it("Should call signal signalRepository insertNewSignal function with correct arguments", sinon.test(function() {
            var insertNewSignalSpy = this.spy(signalRepository, 'insertNewSignal');

            PersistenceService.storeSignalInformation(signalId, category, unity);

            sinon.assert.calledWith(insertNewSignalSpy, signalId, category, unity);
        }))
    });

    describe("save Signal Value",  function() {
        it("Should call signal signalRepository insertSignalValue function with correct arguments", sinon.test(function () {
            var insertSignalValueSpy = this.spy(signalRepository, 'insertSignalValue');

            PersistenceService.saveSignalValue(signalId, value);

            sinon.assert.calledWith(insertSignalValueSpy, signalId, value);
        }))
    });
    describe("get Recording Dates", function() {
        it("Should call signal signalRepository getRecordingDates function", sinon.test(function() {
            var getRecordingDatesSpy = this.spy(signalRepository, 'getRecordingDates');

            PersistenceService.getRecordingDates();

            sinon.assert.called(getRecordingDatesSpy);
        }))
    });
    describe("get Signals Id", function() {
        it("Should call signal signalRepository getSignalsId function", sinon.test(function() {
            var getSignalsIdSpy = this.spy(signalRepository, 'getSignalsId');

            PersistenceService.getSignalsId();

            sinon.assert.called(getSignalsIdSpy);
        }))
    });
    describe("get Signals Unity", function() {
        it("Should call signal signalRepository getSignalsUnity function", sinon.test(function() {
            var getSignalsUnitySpy = this.spy(signalRepository, 'getSignalsUnity');

            PersistenceService.getSignalsUnity();

            sinon.assert.called(getSignalsUnitySpy);
        }))
    });
    describe("get Signals Categories", function() {
        it("Should call signal signalRepository getSignalsCategories function", sinon.test(function() {
            var getSignalsCategoriesSpy = this.spy(signalRepository, 'getSignalsCategories');

            PersistenceService.getSignalsCategories();

            sinon.assert.called(getSignalsCategoriesSpy);
        }))
    });
    describe("get Signals Values", function() {
        it("Should call signal signalRepository getSignalsValues function with correct arguments", sinon.test(function() {
            var getSignalsValuesSpy = this.spy(signalRepository, 'getSignalsValues');

            PersistenceService.getSignalsValues(signalId, category, unity, startDate, endDate);

            sinon.assert.calledWith(getSignalsValuesSpy, signalId, category, unity, startDate, endDate);
        }))
    });
    describe("get Signals", function() {
        it("Should call signal signalRepository getSignals function with correct arguments", sinon.test(function() {
            var getSignalsSpy = this.spy(signalRepository, 'getSignals');

            PersistenceService.getSignals(signalId, category, unity);

            sinon.assert.calledWith(getSignalsSpy, signalId, category, unity);
        }))
    });
    describe("get Not Displayed SignalsId", function() {
        it("Should call signal signalRepository getNotDisplayedSignalsId function", sinon.test(function() {
            var getNotDisplayedSignalsIdSpy = this.spy(signalRepository, 'getNotDisplayedSignalsId');

            PersistenceService.getNotDisplayedSignalsId();

            sinon.assert.called(getNotDisplayedSignalsIdSpy);
        }))
    });
    describe("remove Signal From Display", function() {
        it("Should call signal signalRepository updateSignalStatus function with correct arguments", sinon.test(function() {
            var updateSignalStatusSpy = this.spy(signalRepository, 'updateSignalStatus');

            PersistenceService.removeSignalFromDisplay(signalId);

            sinon.assert.calledWith(updateSignalStatusSpy, signalId, 0);
        }))
    });
    describe("add Signal On Display", function() {
        it("Should call signal signalRepository updateSignalStatus function with correct arguments", sinon.test(function() {
            var updateSignalStatusSpy = this.spy(signalRepository, 'updateSignalStatus');

            PersistenceService.addSignalOnDisplay(signalId);

            sinon.assert.calledWith(updateSignalStatusSpy, signalId, 1);
        }))
    });
    describe("get Signal Infos", function() {
        it("Should call signal signalRepository getSignalInformations function with the same argument", sinon.test(function() {
            var getSignalInformationsSpy = this.spy(signalRepository, 'getSignalInformations');

            PersistenceService.getSignalInfos(signalId);

            sinon.assert.calledWith(getSignalInformationsSpy, signalId);
        }))
    });
    describe("ajouter Batiment", function() {
        it("Should call building signalRepository ajouterBatiment function with the same arguments", sinon.test(function() {
            var addBuildingSpy = this.spy(buildingRepository, 'ajouterBatiment');

            PersistenceService.ajouterBatiment(firm, buildingName, floorNumber, address, zipCode, number);

            sinon.assert.calledWith(addBuildingSpy, firm, buildingName, floorNumber, address, zipCode, number);
        }))
    });
    describe("get firms", function() {
        it("Should call building signalRepository getCompagnies", sinon.test(function() {
            var getFirmsSpy = this.spy(buildingRepository, 'getCompagnies');

            PersistenceService.getCompagnies();

            sinon.assert.called(getFirmsSpy);
        }))
    });
    describe("get firm's Building name", function() {
        it("Should call building signalRepository getCompagnieBatimentsName with the same argument", sinon.test(function() {
            var getFirmBuildingNameSpy = this.spy(buildingRepository, 'getCompagnieBatimentsName');

            PersistenceService.getCompagnieBatimentsName(firm);

            sinon.assert.calledWith(getFirmBuildingNameSpy, firm);
        }))
    });
    describe("get Batiments Information", function() {
        it("Should call building signalRepository getBatimentsInformations with the same arguments", sinon.test(function() {
            var getBuildingInformationSpy = this.spy(buildingRepository, 'getBatimentsInformations');

            PersistenceService.getBatimentsInformations(firm, buildingName);

            sinon.assert.calledWith(getBuildingInformationSpy, firm, buildingName);
        }))
    });
    describe("make Signal Displayable", function() {
        it("Should call signal signalRepository and building signalRepository functions with the specific arguments", sinon.test(function() {
            var updateSignalStatusSpy = this.spy(signalRepository, 'updateSignalStatus');
            var createSignalBuildingInformationSpy = this.spy(buildingRepository, 'createSignalBatimentInformations');
            var updateSignalInformationSpy = this.spy(signalRepository, 'updateSignalInformations');

            PersistenceService.makeSignalDisplayable(signalId, firm, buildingName, floorNumber, unity, category);

            sinon.assert.calledWith(updateSignalStatusSpy, signalId, 1);
            sinon.assert.calledWith(createSignalBuildingInformationSpy, signalId, firm, buildingName, floorNumber);
            sinon.assert.calledWith(updateSignalInformationSpy, signalId, category, unity);
        }))
    });
    describe("update Signal Information", function() {
        it("Should call signal signalRepository and building signalRepository functions with the specific arguments", sinon.test(function() {
            var updateSignalInformationSpy = this.spy(signalRepository, 'updateSignalInformations');
            var updateSignalBuildingInformationSpy = this.spy(buildingRepository, 'updateSignalBatimentInformations');

            PersistenceService.updateSignalInformations(newSignalId, firm, buildingName, floorNumber, unity, category, signalId);

            sinon.assert.calledWith(updateSignalInformationSpy, newSignalId, category, unity, signalId);
            sinon.assert.calledWith(updateSignalBuildingInformationSpy, newSignalId, firm, buildingName, floorNumber);
        }))
    });
    describe("get Building Signals Information", function() {
        it("Should call building signalRepository getBatimentSignals function with the same arguments", sinon.test(function() {
            var getBuildingSignalsSpy = this.spy(buildingRepository, 'getBatimentSignals');

            PersistenceService.getBatimentSignalsInformations(firm, buildingName, floorNumber);

            sinon.assert.calledWith(getBuildingSignalsSpy, firm, buildingName, floorNumber);
        }))
    });
    describe("update Building Information", function() {
        it("Should call building signalRepository updateBatimentInformations function with the same arguments", sinon.test(function() {
            var updateBuildingInformationSpy = this.spy(buildingRepository, 'updateBatimentInformations');

            PersistenceService.updateBatimentInformations(buildingId, firm, buildingName, floorNumber, address, zipCode, number);

            sinon.assert.calledWith(updateBuildingInformationSpy, buildingId, firm, buildingName, floorNumber, address, zipCode, number);
        }))
    });
    describe("delete Building", function() {
        it("Should call building signalRepository deleteBatiment function with the same argument", sinon.test(function() {
            var deleteBuildingSpy = this.spy(buildingRepository, 'deleteBatiment');

            PersistenceService.deleteBatiment(buildingId);

            sinon.assert.calledWith(deleteBuildingSpy, buildingId);
        }))
    });
});