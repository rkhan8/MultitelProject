/*
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'multitelroot',
 database : 'Multitel'
 });

 var EventEmitter = require('events').EventEmitter;
 var PreloadValueEvent = new EventEmitter();
 PreloadValueEvent.setMaxListeners(0);


 function queryLoad()
 {
 //connection.connect();
 //load idN, category and unity
 connection.query('SELECT * from Signals', function(err, rows, fields) {
 if (!err)
 {
 //console.log('Résultat: ', rows);
 }
 else
 {
 console.log('Erreur de la requete');
 }
 PreloadValueEvent.emit('LoadFirstData', rows);

 });

 //load start and end date
 connection.query('SELECT DISTINCT DateRec from SignalValue', function(err, rows2, fields) {
 if (!err)
 {
 //console.log('Résultat: ', rows2);
 }
 else
 {
 console.log('Erreur de la requete');
 }
 PreloadValueEvent.emit('LoadSecondData', rows2);
 });
 }

 function QuerySearch(idN, category, unity, startDate, endDate)
 {
 var idNAns = idN;
 var categoryAns = "";
 var unityAns = "";
 var DateAns = "";
 var conditions = "";

 if(idN != "" || category != "" || unity != "" || startDate != "" || endDate != "")
 {
 conditions = "WHERE";

 if(idN != "")
 {
 idNAns = "Signals.idN ='"+idN+"'";
 }
 else
 {
 idNAns = "";
 }


 if(category != "")
 {
 if(idN != "")
 {
 categoryAns = "AND Signals.Category ='"+category+"' ";
 }
 else {
 categoryAns = "Signals.Category ='"+category+"'";
 }
 }
 else
 {
 categoryAns = "";
 }


 if(unity != "")
 {
 if(idN != "" || category != "" /!*|| startDate != "" || endDate != ""*!/)
 {
 unityAns = "AND Signals.Unity ='"+unity+"' ";
 }
 else {
 unityAns = "Signals.Unity ='"+unity+"'";
 }
 }
 else
 {
 unityAns = "";
 }


 if(startDate != "" && endDate != "")
 {
 if(idN != "" || category != "" || unity != "")
 {
 DateAns = "AND (SignalValue.DateRec BETWEEN '"+startDate+"' AND '"+endDate+"') ";
 }
 else {
 DateAns = "SignalValue.DateRec BETWEEN '"+startDate+"' AND '"+endDate+"'";
 }
 }
 else
 {
 DateAns = "";
 }


 }
 else {
 conditions = "";
 }

 connection.query('select Signals.idN, Signals.Category, Signals.MinVal, Signals.MaxVal, SignalValue.ValueRec, Signals.Unity, SignalValue.DateRec from Signals natural join SignalValue '+conditions+' '+idNAns+' '+categoryAns+' '+unityAns+' '+DateAns+';', function(err, rows, fields) {
 if (!err)
 {
 //console.log('Résultat: ', rows);
 }
 else
 {
 console.log('Erreur de la requete');
 console.log(err);
 }
 PreloadValueEvent.emit('SearchData', rows);
 });
 }

 exports.queryLoad = queryLoad;
 exports.QuerySearch = QuerySearch;
 exports.PreloadValueEvent = PreloadValueEvent;
 */
var SignalRepository = require('../Repository/SignalRepository');
var batimentRepository = require ('../Repository/BatimentRepository');
var EventEmitter = require('events').EventEmitter;
var persistenceEvent = new EventEmitter();



initialisePersistenceError();

initialisePersitenceEvent();





exports.storeSignalInformation = function(signalId, category, minVal, maxVal, unity) {
        SignalRepository.insertNewSignal(signalId, category, minVal, maxVal, unity);
}

exports.saveSignalValue = function(signalId, value) {
    SignalRepository.insertSignalValue(signalId, value);
}

exports.getSignalFromDB = function(signalId, category, minVal, maxVal, unity) {
    SignalRepository.getSignalFromDB(signalId, category, minVal, maxVal, unity);

}

exports.getRecordingDates = function(){
    SignalRepository.getRecordingDates();
}

exports.getSignalsId = function(){
    SignalRepository.getSignalsId();
}

exports.getSignalsUnity = function(){
    SignalRepository.getSignalsUnity();
}

exports.getSignalsCategories= function(){
    SignalRepository.getSignalsCategories();
}

exports.getSignalsValues = function(signalId, category, unity, startDate, endDate) {
    SignalRepository.getSignalsValues(signalId,category, unity, startDate, endDate);
}
exports.getSignals = function(signalId, category, minVal, maxVal, unity){
    SignalRepository.getSignals(signalId, category, minVal, maxVal, unity)
}

exports.ajouterBatiment = function(Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero){
    batimentRepository.ajouterBatiment(Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero);
}

function initialisePersistenceError() {
    SignalRepository.SignalRepositoryEvent.on('signalCreateError', function (signalId) {
        persistenceEvent.emit('signalCreateError', signalId);
    });

    SignalRepository.SignalRepositoryEvent.on('getSignalsError', function (signalId) {
        persistenceEvent.emit('getSignalsError', '');
    });


    SignalRepository.SignalRepositoryEvent.on('signalValueCreateError', function (signalId) {
        persistenceEvent.emit('signalValueCreateError', signalId);
    });

    SignalRepository.SignalRepositoryEvent.on('signalValueRecordingDateError', function () {
        persistenceEvent.emit('errorGetRecordingDate', '');
    });

    SignalRepository.SignalRepositoryEvent.on('signalsIdError', function () {
        persistenceEvent.emit('errorGetSignalsId', '');
    });

    SignalRepository.SignalRepositoryEvent.on('signalsUnityError', function () {
        persistenceEvent.emit('errorGetSignalsUnity', '');
    });

    SignalRepository.SignalRepositoryEvent.on('signalsCategoriesError', function () {
        persistenceEvent.emit('errorSignalsCategories', '');
    });

    batimentRepository.batimentRepositoryEvent.on('ajouterBatimentError', function(message){
        persistenceEvent.emit('errorAjouterBatiment',message);
    })
}
function initialisePersitenceEvent() {
    SignalRepository.SignalRepositoryEvent.on('signalsCategoriesFound', function (data) {
        persistenceEvent.emit('signalsCategories', data);
    });

    SignalRepository.SignalRepositoryEvent.on('searchSignalValueError', function () {
        persistenceEvent.emit('getSignalValueError', '');
    });

    SignalRepository.SignalRepositoryEvent.on('signalCreated', function (signalInfos) {
        persistenceEvent.emit('signalCreated', signalInfos);
    });

    SignalRepository.SignalRepositoryEvent.on('signalValueRecordingDateFound', function (data) {
        persistenceEvent.emit('recordingDates', data);
    });
    SignalRepository.SignalRepositoryEvent.on('signalsFounded', function (data) {
        persistenceEvent.emit('signalsData', data);
    });

    SignalRepository.SignalRepositoryEvent.on('signalsIdFound', function (data) {
        persistenceEvent.emit('signalsId', data);
    });

    SignalRepository.SignalRepositoryEvent.on('signalsUnityFound', function (data) {
        persistenceEvent.emit('signalsUnity', data);
    });

    SignalRepository.SignalRepositoryEvent.on('signalValueFound', function (data) {
        persistenceEvent.emit('signalValueData', data);
    });
}


exports.persistenceEvent = persistenceEvent;
