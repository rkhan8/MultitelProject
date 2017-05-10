var signalRepository = require('../Repository/SignalRepository');
var batimentRepository = require('../Repository/BatimentRepository');
var EventEmitter = require('events').EventEmitter;
var persistenceEvent = new EventEmitter();

initialisePersistenceError();

initialisePersitenceEvent();

exports.storeSignalInformation = function (signalId, category, unity) {
    signalRepository.insertNewSignal(signalId, category, unity);
};
exports.saveSignalValue = function (signalId, value) {
    signalRepository.insertSignalValue(signalId, value);
};

exports.getRecordingDates = function () {
    signalRepository.getRecordingDates();
};

exports.getSignalsId = function () {
    signalRepository.getSignalsId();
};

exports.getSignalsUnity = function () {
    signalRepository.getSignalsUnity();
};

exports.getSignalsCategories = function () {
    signalRepository.getSignalsCategories();
};

exports.getSignalsValues = function (signalId, category, unity, startDate, endDate) {
    signalRepository.getSignalsValues(signalId, category, unity, startDate, endDate);
};
exports.getSignals = function (signalId, category, unity) {
    signalRepository.getSignals(signalId, category, unity)
};
exports.getNotDisplayedSignalsId = function () {
    signalRepository.getNotDisplayedSignalsId();
};
exports.getDisplaySignalSignal = function(view){
    signalRepository.getSignalByStatus(1, view);
};
exports.removeSignalFromDisplay = function(signalId){
    signalRepository.updateSignalStatus(signalId, 0);
};
exports.addSignalOnDisplay = function(signalId){
    signalRepository.updateSignalStatus(signalId, 1);
};
exports.deleteSignalPosition = function(singnalId, view){
    signalRepository.deleteSignalPosition(singnalId, view);
};
exports.updateSignalPosition = function(signalId, positionLeft, positionTop, view){
    signalRepository.updateSignalPosition(signalId, positionLeft, positionTop, view);
};
exports.getSignalInfos = function(signalId){
    signalRepository.getSignalInformations(signalId);
};

exports.ajouterBatiment = function (Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero) {
    batimentRepository.ajouterBatiment(Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero);
};
exports.getCompagnies = function () {
    batimentRepository.getCompagnies();
};
exports.getCompagnieBatimentsName = function (compagnie) {
    batimentRepository.getCompagnieBatimentsName(compagnie);
};
exports.getBatimentsInformations = function (compagnie, nomBatiment) {
    batimentRepository.getBatimentsInformations(compagnie, nomBatiment);
};

exports.makeSignalDisplayable = function (signalId, compagnie, nomBatiment, Etage, unity, category){
    signalRepository.updateSignalStatus(signalId, 1);
    batimentRepository.createSignalBatimentInformations(signalId, compagnie, nomBatiment, Etage);
    signalRepository.updateSignalInformations(signalId,category, unity);

};
exports.updateSignalInformations = function(signalId, compagnie, nomBatiment, Etage, unity, category, oldSignalId){
    signalRepository.updateSignalInformations(signalId,category, unity, oldSignalId);
    batimentRepository.updateSignalBatimentInformations(signalId, compagnie, nomBatiment, Etage);
};
exports.createSignalPosition = function(signalId, positionLeft, positionTop,view){
    signalRepository.createSignalPosition(signalId, positionLeft, positionTop,view);
};
exports.updateSignalPosition= function(signalId, positionLeft, positionTop,view){
    signalRepository.updateSignalPosition(signalId, positionLeft, positionTop,view);
};

exports.getBatimentSignalsInformations = function( compagnie, nombatiment,numeroEtage){
    batimentRepository.getBatimentSignals(compagnie, nombatiment, numeroEtage);
};
exports.updateBatimentInformations = function(batimentId,Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero){
    batimentRepository.updateBatimentInformations(batimentId,Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero);
};
exports.deleteBatiment = function(batimentId){
    batimentRepository.deleteBatiment(batimentId);
};

function initialisePersistenceError() {
    signalRepository.signalRepositoryEvent.on('signalCreateError', function (signalId) {
        persistenceEvent.emit('signalCreateError', signalId);
    });
    signalRepository.signalRepositoryEvent.on('getSignalsError', function (signalId) {
        persistenceEvent.emit('getSignalsError', '');
    });
    signalRepository.signalRepositoryEvent.on('signalValueCreateError', function (signalId) {
        persistenceEvent.emit('signalValueCreateError', signalId);
    });
    signalRepository.signalRepositoryEvent.on('signalValueRecordingDateError', function () {
        persistenceEvent.emit('errorGetRecordingDate', '');
    });
    signalRepository.signalRepositoryEvent.on('signalsIdError', function () {
        persistenceEvent.emit('errorGetSignalsId', '');
    });
    signalRepository.signalRepositoryEvent.on('signalsUnityError', function () {
        persistenceEvent.emit('errorGetSignalsUnity', '');
    });

    signalRepository.signalRepositoryEvent.on('signalsCategoriesError', function () {
        persistenceEvent.emit('errorSignalsCategories', '');
    });
    signalRepository.signalRepositoryEvent.on('searchNotDisplayedSignalsError', function (details) {
        persistenceEvent.emit('errorSearchNotDisplayedSignals', details);
    });
    signalRepository.signalRepositoryEvent.on('getSignalDisplayedErr', function(details){
        persistenceEvent.emit('errorGetDisplayedSignal', details);
    });
    signalRepository.signalRepositoryEvent.on('signalUpdateError', function(details){
        persistenceEvent.emit('errorSignalUpdate', details);
    });
    signalRepository.signalRepositoryEvent.on('createSignalPositionError', function(details){
        persistenceEvent.emit('errorCreateSignalPosition', details);
    });

    batimentRepository.batimentRepositoryEvent.on('ajouterBatimentError', function (message) {
        persistenceEvent.emit('errorAjouterBatiment', message);
    });
    batimentRepository.batimentRepositoryEvent.on('searchCompagniesError', function (data) {
        persistenceEvent.emit('errorSearchCompagnies', data);
    });
    batimentRepository.batimentRepositoryEvent.on('searchBatimentsError', function (data) {
        persistenceEvent.emit('errorSearchBatimentsName', data);
    });
    batimentRepository.batimentRepositoryEvent.on('searchBatimentInfosError', function (details) {
        persistenceEvent.emit('errorSearchBatimentInfos', details);
    });
    batimentRepository.batimentRepositoryEvent.on('createBatimentInfosError', function(details){
       persistenceEvent.emit('errorCreateBatimentInfos',details)
    });
    batimentRepository.batimentRepositoryEvent.on('batimentInfosUpdatedError', function(details){
        persistenceEvent.emit('errorBatimentInfosUpdated',details)
    });
    batimentRepository.batimentRepositoryEvent.on('getBatimentSignalInformationsError',function(details){
       persistenceEvent.emit('errorGetBatimentSignalInformations', details);
    });
    batimentRepository.batimentRepositoryEvent.on('errorBatimentUpdate', function(data){
        persistenceEvent.emit('batimentSignalInformations', data);
    });
    batimentRepository.batimentRepositoryEvent.on('errorDeleteBatiment', function(data){
        persistenceEvent.emit('batimentSignalInformations', data);
    });
}

function initialisePersitenceEvent() {
    signalRepository.signalRepositoryEvent.on('signalsCategoriesFound', function (data) {
        persistenceEvent.emit('signalsCategories', data);
    });

    signalRepository.signalRepositoryEvent.on('searchSignalValueError', function () {
        persistenceEvent.emit('getSignalValueError', '');
    });

    signalRepository.signalRepositoryEvent.on('signalCreated', function (signalInfos) {
        persistenceEvent.emit('signalCreated', signalInfos);
    });
    signalRepository.signalRepositoryEvent.on('signalUpdated', function(signalInfos){

        persistenceEvent.emit('signalUpdated', signalInfos);
    });
    signalRepository.signalRepositoryEvent.on('signalValueRecordingDateFound', function (data) {
        persistenceEvent.emit('recordingDates', data);
    });
    signalRepository.signalRepositoryEvent.on('signalsFounded', function (data) {
        persistenceEvent.emit('signalsData', data);
    });
    signalRepository.signalRepositoryEvent.on('signalsIdFound', function (data) {
        persistenceEvent.emit('signalsId', data);
    });
    signalRepository.signalRepositoryEvent.on('signalsUnityFound', function (data) {
        persistenceEvent.emit('signalsUnity', data);
    });
    signalRepository.signalRepositoryEvent.on('notDisplayedSignalsFound', function (data) {
        persistenceEvent.emit('notDisplayedSignals', data);
    });
    signalRepository.signalRepositoryEvent.on('signalsByStatusFounded', function(data){
        persistenceEvent.emit('displayedSignals', data);
    });
    signalRepository.signalRepositoryEvent.on('signalValueFound', function (data) {
        persistenceEvent.emit('signalValueData', data);
    });
    signalRepository.signalRepositoryEvent.on('signalPositionDeleted',function(){
        persistenceEvent.emit('signalPositionDeleted');
    });
    signalRepository.signalRepositoryEvent.on('signalPositionUdpate', function(){
        persistenceEvent.emit('signalPositionUdpate');
    });
    signalRepository.signalRepositoryEvent.on('signalStatusUpdated', function(){
        persistenceEvent.emit('signalStatusUpdated');
    });
    signalRepository.signalRepositoryEvent.on('signalPositionCreated', function(){
        persistenceEvent.emit('signalPositionCreated')
    });


    batimentRepository.batimentRepositoryEvent.on('batimentAjouterOk', function () {
        persistenceEvent.emit('batimentAjouterOk');
    });
    batimentRepository.batimentRepositoryEvent.on('compagniesFound', function (data) {
        persistenceEvent.emit('compagnies', data);
    });
    batimentRepository.batimentRepositoryEvent.on('batimentsFound', function (data) {
        persistenceEvent.emit('batimentsName', data);
    });
    batimentRepository.batimentRepositoryEvent.on('batimentInfosFound', function (data) {
        persistenceEvent.emit('batimentInfos', data);
    });
    batimentRepository.batimentRepositoryEvent.on('signalBatimentInfosCreated', function(){
        persistenceEvent.emit('signalBatimentInfosCreated')
    });
    batimentRepository.batimentRepositoryEvent.on('signalBatimentInfosUpdated', function(){
        persistenceEvent.emit('signalBatimentInfosUpdated')
    });
    batimentRepository.batimentRepositoryEvent.on('batimentSignalInformations', function(data){
        persistenceEvent.emit('batimentSignalInformations', data);
    });
    batimentRepository.batimentRepositoryEvent.on('batimentUpdated',function(){
        persistenceEvent.emit('batimentUpdated');
    });
    batimentRepository.batimentRepositoryEvent.on('batimentDeleted', function(){
        persistenceEvent.emit('batimentDeleted');
    });

}

exports.persistenceEvent = persistenceEvent;
