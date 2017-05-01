/**
 * Created by angem on 2017-02-18.
 */
var ArrayList = require('arraylist');
var Signal = require('../DomaineModel/Signal');



var EventEmitter = require('events').EventEmitter;
var signals = new ArrayList;
var signalsId = new ArrayList;
var signalServiceEvent = new EventEmitter();
signalServiceEvent.setMaxListeners(0);
var interval;


exports.createSignal = function (signalInfos) {
    var index = searchSignalById(signalInfos.signalId);
    if (index === -1) {
        var signal = new Signal(signalInfos.signalId, signalInfos.category, signalInfos.valMin, signalInfos.valMax, signalInfos.unity);
        signals.add(signal);

    }
    else {
        signalServiceEvent.emit('errorExistingSignalId', 'Ce generateur existe deja. Choisissez un autre nom de generateur');
    }
}


exports.createSignals = function (capteurInfos) {
    capteurInfos.forEach(function (capteur) {
        var signal = new Signal(capteur.idCapteur, capteur.categorie, capteur.valeurMax, capteur.valeurMin);
        signals.add(signal);
        signalsId.add(capteur.idCapteur);
    });
}

exports.getSignals = function () {
    return JSON.parse(JSON.stringify(signals));
}

exports.updateSignal = function (signalInfos) {
    var index = searchSignalById(signalInfos.oldSignalId);
    if (index != -1) {
        signals.get(index).updateSignal(signalInfos.signalId, signalInfos.category, signalInfos.unity);

    }
    else {
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouver');
    }
}

function searchSignalById(signalId) {
    for (i = 0; i < signals.length; i++) {
        if (signalId === signals.get(i).getSignalID())
            return i;
    }
    return -1;
}

exports.activateGenerators = function () {
    clearInterval(interval);
    interval = setInterval(function () {
        for (i = 0; i < signals.length; i++) {
            var values = signals.get(i).nextValue();
            signalServiceEvent.emit('newValueHasGenerate', values);
        }

    }, 500);

}
exports.getSignalsIdList = function(){
    return signalsId;
}


exports.getSignalInformations = function (signalId) {
    var index = searchSignalById(signalId);
    if (index != -1) {
        var infos = signals.get(index).getSignalInformations();
        signalServiceEvent.emit('signalInfos', infos);
    }
    else {
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouver');
    }

}


exports.signalServiceEvent = signalServiceEvent;

