/**
 * Created by Safa on 2017-05-10.
 */
'use strict';
var expect = require("chai").expect;
var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);

var connection = require('../backend/Repository/DBconnection');
var persistenceService = require('../backend/Service/PersistenceService.js');
var signalValueModel = connection.db.signalValueModel;
var signalModel = connection.db.signalModel;

var signalTest = {
    idN: "signalIdTest55",
    Category: 'analog',
    Unity: "Joule"
};
var signalIdTest = "sign5";
var categoryTest = "analog";
var unityTest = "Joule";
var valueTest = 17.2;
var startDateTest = "2017-05-10";
var endDateTest = "2017-05-12";
var signalIdTest2 = "sign9";
var categoryTest2 = "analog";
var unityTest2 = "volt";
var firm = "UbiSoft";
var buildingName = "La ronde";
var floorCount = 5;
var address = "avenue cartier";
var zipCode = "D4E 7W8";
var streetNb = 155;

describe("Persistence Service Unit Test", function() {
    describe('store Signal Information', function () {
        it('Should store correct signal information in the DB', function () {
            setTimeout(function () {
                persistenceService.storeSignalInformation(signalIdTest, categoryTest, unityTest);

                var getIdFromDB;
                var getCategoryFromDB;
                var getUnityFromDB;
                signalModel.find({
                    where: {
                        idN: signalIdTest,
                        Category: categoryTest,
                        Unity: unityTest
                    }
                }).then(function (result) {
                    getIdFromDB = JSON.parse(JSON.stringify(result.idN));
                    getCategoryFromDB = JSON.parse(JSON.stringify(result.Category));
                    getUnityFromDB = JSON.parse(JSON.stringify(result.Unity));

                    expect(getIdFromDB).to.equal(signalIdTest);
                    expect(getCategoryFromDB).to.equal(categoryTest);
                    expect(getUnityFromDB).to.equal(unityTest);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });

    describe('save Signal Value', function() {
        it('Should save the correct signal value in the DB', function() {
            setTimeout(function () {
                persistenceService.saveSignalValue(signalIdTest, valueTest);

                var getIdFromDB;
                var getValueFromDB;
                signalValueModel.find({
                    where: {
                        idN: signalIdTest
                    }
                }).then(function(result) {
                    getIdFromDB = JSON.parse(JSON.stringify(result.idN));
                    getValueFromDB = JSON.parse(JSON.stringify(result.ValueRec));

                    expect(getIdFromDB).to.equal(signalIdTest);
                    expect(getValueFromDB).to.equal(valueTest);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });

   describe('get Recording Dates', function() {
        it('should return the list of recording dates from the DB', function() {
            setTimeout(function () {
                var datesList = persistenceService.getRecordingDates();

                var getDatesFromDB;
                signalValueModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT DATE(`DateRec`)'), 'DateRec']]
                }).then(function(result) {
                    getDatesFromDB = JSON.parse(JSON.stringify(result));

                    expect(datesList).to.equal(getDatesFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        });
    });

    describe('get Signals Id', function() {
        it('Should return the list of signal ids from the DB', function() {
            setTimeout(function () {
                persistenceService.storeSignalInformation(signalIdTest, categoryTest, unityTest);
                persistenceService.storeSignalInformation(signalIdTest2, categoryTest2, unityTest2);

                var signalList = persistenceService.getSignalsId();

                var getSignalsFromDB;
                signalModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT idN'), 'idN']]
                }).then(function(result) {
                    getSignalsFromDB = JSON.parse(JSON.stringify(result));

                    expect(signalList).to.equal(getSignalsFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);

        })
    });

    describe('get Signals Unity', function() {
        it('Should return the list of signal unities from the DB', function() {
            setTimeout(function () {
                var unityList = persistenceService.getSignalsUnity();

                var getUnitiesFromDB;
                signalModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT Unity'), 'Unity']]
                }).then(function(result) {
                    getUnitiesFromDB = JSON.parse(JSON.stringify(result));

                    expect(unityList).to.equal(getUnitiesFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });

    describe('get Signals categories', function() {
        it('Should return the list of signal categories from the DB', function() {
            setTimeout(function () {
                var categoryList = persistenceService.getSignalsCategories();

                var getCategoriesFromDB;
                signalModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT Category'), 'Category']]
                }).then(function(result) {
                    getCategoriesFromDB = JSON.parse(JSON.stringify(result));

                    expect(categoryList).to.equal(getCategoriesFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });

    describe('get Signals Values', function() {
        it('Should return the correct signal value from the DB', function() {
            setTimeout(function () {
                var signalValue = persistenceService.getSignalsValues(signalIdTest, categoryTest, unityTest, startDateTest, endDateTest);

                var getSignalValueFromDB;
                signalValueModel.findAll({
                    where: {
                        idN: signalTest,
                        category: categoryTest,
                        unity: unityTest
                    },
                    include: [{
                        model: signalModel,
                        include:[{
                            model:connection.db.signalBatimentModel,
                            include:[{
                                model:connection.db.batimentModel
                            }]
                        }]
                    }
                    ]
                    ,limit: 4
                }).then(function(result) {
                    getSignalValueFromDB = JSON.parse(JSON.stringify(result));

                    expect(signalValue).to.equal(getSignalValueFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);

        })
    });

    describe('get Signals', function() {
        it('Should return the correct signal from the DB', function() {
            setTimeout(function () {
                var signal = persistenceService.getSignals(signalIdTest, categoryTest, unityTest);

                var getSignalFromDB;
                connection.db.signalModel.findAll({
                    where: {
                        idN: signalTest,
                        category: categoryTest,
                        unity: unityTest
                    }
                }).then(function(result) {
                    getSignalFromDB = JSON.parse(JSON.stringify(result));

                    expect(signal).to.equal(getSignalFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('get Not Displayed Signals Id', function() {
        it('Should return the correct not Displayed Signals Id from the DB', function() {
            setTimeout(function () {
                var notDipslayedSignIds = persistenceService.getNotDisplayedSignalsId();

                var getNotDisplayedIdsFromDB;
                connection.db.signalStatusModel.findAll({
                    attributes: ['idN'],
                    where: {
                        status: 0
                    }
                }).then(function(result) {
                    getNotDisplayedIdsFromDB = JSON.parse(JSON.stringify(result));

                    expect(notDipslayedSignIds).to.equal(getNotDisplayedIdsFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('remove Signal From Display', function() {
        it('Should change the status of the specific signal to 0 ', function() {
            setTimeout(function () {
                persistenceService.removeSignalFromDisplay(signalIdTest);

                var signal = persistenceService.getSignals(signalIdTest, categoryTest, unityTest);

                expect(signal.status).to.equal(0);

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('add Signal On Display', function() {
        it('Should change the status of the specific signal to 1', function() {
            setTimeout(function () {
                persistenceService.addSignalOnDisplay(signalIdTest);

                var signal = persistenceService.getSignals(signalIdTest, categoryTest, unityTest);

                expect(signal.status).to.equal(1);

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('get Signal Infos', function() {
        it('Should return the correct signal infos from the DB', function() {
            setTimeout(function () {
                var info = persistenceService.getSignalInfos(signalIdTest);

                var getInfoFromDB;
                connection.db.signalModel.findOne({
                    where: {
                        idN:signalIdTest
                    }, include: [{
                        model: connection.db.signalBatimentModel
                        , include:[{
                            model:connection.db.batimentModel
                        }]}

                    ]
                }
                ).then(function (result) {
                    getInfoFromDB = JSON.parse(JSON.stringify(result));
                    expect(info).to.equal(getInfoFromDB);
                });

                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('ajouter batiment', function() {
        it('Should add the correct building information in the DB', function() {
            setTimeout(function () {
                persistenceService.ajouterBatiment(firm, buildingName, floorCount, address, zipCode, streetNb);

                connection.db.batimentModel.findOne({
                    where: {
                        Compagnie: firm,
                        NomBatiment: buildingName
                    }
                }).then(function (result) {
                    var createdBuilding = JSON.parse(JSON.stringify(result));
                    expect(createdBuilding.Compagnie).to.equal(firm);
                    expect(createdBuilding.NomBatiment).to.equal(buildingName);
                    expect(createdBuilding.NbEtages).to.equal(floorCount);
                    expect(createdBuilding.Adresse).to.equal(address);
                    expect(createdBuilding.CodePostal).to.equal(zipCode);
                    expect(createdBuilding.Numero).to.equal(streetNb);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('get Compagnies', function() {
        it('Should get all the firms from the DB', function() {
            setTimeout(function () {
                var firmsList = persistenceService.getCompagnies();

                connection.db.batimentModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT Compagnie'), 'Compagnie']]
                }).then(function (result) {
                    var firmsListFromDB = JSON.parse(JSON.stringify(result));

                    expect(firmsList).to.equal(firmsListFromDB);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('get Compagnie Batiments Name', function() {
        it('Should get the correct buildings name of the firm from the DB', function() {
            setTimeout(function () {
                var buildingName = persistenceService.getCompagnieBatimentsName(firm);

                connection.db.batimentModel.findAll({
                    attributes: [[connection.sequelize.literal('DISTINCT NomBatiment'), 'NomBatiment']],
                    where: {
                        Compagnie: firm
                    }
                }).then(function (result) {
                    var buildingNameFromDB = JSON.parse(JSON.stringify(result));

                    expect(buildingName).to.equal(buildingNameFromDB);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
    describe('get Batiments Informations', function() {
        it('Should get the correct building information from the DB', function() {
            setTimeout(function () {
                var buildingInfo = persistenceService.getBatimentsInformations(firm, buildingName);

                connection.db.batimentModel.findAll({
                    where: {
                        Compagnie: firm,
                        NomBatiment: buildingName
                    }
                }).then(function (result) {
                    var buildingInfoFromDB = JSON.parse(JSON.stringify(result));

                    expect(buildingInfo.Compagnie).to.equal(buildingInfoFromDB.Compagnie);
                    expect(buildingInfo.NomBatiment).to.equal(buildingInfoFromDB.NomBatiment);
                });
                //noinspection JSAnnotator
                setTimeout(arguments.callee, 50);
            }, 50);
        })
    });
});