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
var signalRepository = require('../Repository/SignalRepository');
var batimentRepository = require('../Repository/BatimentRepository');
var EventEmitter = require('events').EventEmitter;
var persistenceEvent = new EventEmitter();


initialisePersistenceError();

initialisePersitenceEvent();


exports.storeSignalInformation = function (signalId, category, minVal, maxVal, unity) {
    signalRepository.insertNewSignal(signalId, category, minVal, maxVal, unity);
}

exports.saveSignalValue = function (signalId, value) {
    signalRepository.insertSignalValue(signalId, value);
}

exports.getSignalFromDB = function (signalId, category, minVal, maxVal, unity) {
    signalRepository.getSignalFromDB(signalId, category, minVal, maxVal, unity);

}

exports.getRecordingDates = function () {
    signalRepository.getRecordingDates();
}

exports.getSignalsId = function () {
    signalRepository.getSignalsId();
}

exports.getSignalsUnity = function () {
    signalRepository.getSignalsUnity();
}

exports.getSignalsCategories = function () {
    signalRepository.getSignalsCategories();
}

exports.getSignalsValues = function (signalId, category, unity, startDate, endDate) {
    signalRepository.getSignalsValues(signalId, category, unity, startDate, endDate);
}
exports.getSignals = function (signalId, category, minVal, maxVal, unity) {
    signalRepository.getSignals(signalId, category, minVal, maxVal, unity)
};
exports.getNotDiplayedSignalsId = function () {
    signalRepository.getNotDiplayedSignalsId();
};
exports.getDisplaySignalSignal = function(){
    signalRepository.getSignalByStatus(1);
};
exports.removeSignalFromDisplay = function(signalId){
    signalRepository.updateSignalStatus(signalId, 0);
};
exports.addSignalOnDisplay = function(signalId){
    signalRepository.updateSignalStatus(signalId, 1);
};
exports.deleteSignalPosition = function(singnalId){
    signalRepository.deleteSignalPosition(singnalId);
};
exports.updateSignalPosition = function(signalId, positionLeft, posistion, view){
    signalRepository.updateSignalPosition(signalId, positionLeft, posistion, view);
};

exports.ajouterBatiment = function (Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero) {
    batimentRepository.ajouterBatiment(Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero);
}
exports.getCompagnies = function () {
    batimentRepository.getCompagnies();
};
exports.getCompagnieBatimentsName = function (compagnie) {
    batimentRepository.getCompagnieBatimentsName(compagnie);
};
exports.getBatimentsInformations = function (compagnie, nomBatiment) {
    batimentRepository.getBatimentsInformations(compagnie, nomBatiment);
};


function initialisePersistenceError() {
    signalRepository.SignalRepositoryEvent.on('signalCreateError', function (signalId) {
        persistenceEvent.emit('signalCreateError', signalId);
    });

    signalRepository.SignalRepositoryEvent.on('getSignalsError', function (signalId) {
        persistenceEvent.emit('getSignalsError', '');
    });


    signalRepository.SignalRepositoryEvent.on('signalValueCreateError', function (signalId) {
        persistenceEvent.emit('signalValueCreateError', signalId);
    });

    signalRepository.SignalRepositoryEvent.on('signalValueRecordingDateError', function () {
        persistenceEvent.emit('errorGetRecordingDate', '');
    });

    signalRepository.SignalRepositoryEvent.on('signalsIdError', function () {
        persistenceEvent.emit('errorGetSignalsId', '');
    });

    signalRepository.SignalRepositoryEvent.on('signalsUnityError', function () {
        persistenceEvent.emit('errorGetSignalsUnity', '');
    });

    signalRepository.SignalRepositoryEvent.on('signalsCategoriesError', function () {
        persistenceEvent.emit('errorSignalsCategories', '');
    });
    signalRepository.SignalRepositoryEvent.on('searchNotDisplayedSignalsError', function (details) {
        persistenceEvent.emit('errorSearchNotDisplayedSignals', details);
    });
    signalRepository.SignalRepositoryEvent.on('getSignalDisplayedErr', function(details){
        persistenceEvent.emit('errorGetDisplayedSignal', details);
    })

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
}
function initialisePersitenceEvent() {
    signalRepository.SignalRepositoryEvent.on('signalsCategoriesFound', function (data) {
        persistenceEvent.emit('signalsCategories', data);
    });

    signalRepository.SignalRepositoryEvent.on('searchSignalValueError', function () {
        persistenceEvent.emit('getSignalValueError', '');
    });

    signalRepository.SignalRepositoryEvent.on('signalCreated', function (signalInfos) {
        persistenceEvent.emit('signalCreated', signalInfos);
    });

    signalRepository.SignalRepositoryEvent.on('signalValueRecordingDateFound', function (data) {
        persistenceEvent.emit('recordingDates', data);
    });
    signalRepository.SignalRepositoryEvent.on('signalsFounded', function (data) {
        persistenceEvent.emit('signalsData', data);
    });
    signalRepository.SignalRepositoryEvent.on('signalsIdFound', function (data) {
        persistenceEvent.emit('signalsId', data);
    });
    signalRepository.SignalRepositoryEvent.on('signalsUnityFound', function (data) {
        persistenceEvent.emit('signalsUnity', data);
    });
    signalRepository.SignalRepositoryEvent.on('notDisplayedSignalsFound', function (data) {
        persistenceEvent.emit('notDisplayedSignals', data);
    });
    signalRepository.SignalRepositoryEvent.on('signalsByStatusFounded', function(data){
        persistenceEvent.emit('displayedSignals', data);
    });
    signalRepository.SignalRepositoryEvent.on('signalValueFound', function (data) {
        persistenceEvent.emit('signalValueData', data);
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
    })
}


exports.persistenceEvent = persistenceEvent;
