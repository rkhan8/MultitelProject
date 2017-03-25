/**
 * Created by angem on 2017-02-18.
 */

var Signal = require('../Model/Signal');

var ArrayList = require('arraylist');
var EventEmitter = require('events').EventEmitter;
var signals =  new ArrayList;
var signalServiceEvent = new EventEmitter();
signalServiceEvent.setMaxListeners(0);
var interval;

function createSignal (signalInfos){
    var index = searchSignalById(signalInfos.signalId);
    if(index === -1){
        var signal = new Signal (signalInfos.signalId,signalInfos.category,signalInfos.valMin,signalInfos.valMax);
        signals.add(signal);
    }
    else{
        signalServiceEvent.emit('errorExistingSignalId', 'Ce generateur existe deja. Choisissez un autre nom de generateur');
    }



}

function updateSignal(signalInfos){
    var index = searchSignalById(signalInfos.signalId);
    if(index != -1){
        signals.get(index).updateSignal(signalInfos.signalId,signalInfos.category,signalInfos.valMin,signalInfos.valMax);

    }
    else{
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouver');
    }
}

function searchSignalById(signalId){
    for(i = 0 ; i < signals.length; i++){
        if(signalId === signals.get(i).getGeneratorID() )
            return i;
    }
    return -1;
}

function activateSignal(){
    clearInterval(interval);
    interval = setInterval(function(){
        for( i= 0; i< signals.length; i++){
            var values = signals.get(i).generateValue();
            signalServiceEvent.emit('newValueHasGenerate', values);
        }

    },500);

}

function getSignalInformation(signalId){
    var index = searchSignalById(signalId);
    if(index != -1){
        var infos =  signals.get(index).getSignalInformations();
        signalServiceEvent.emit('signalInfos', infos);

    }
    else{
        signalServiceEvent.emit('errorSignalId', 'Aucun generateur trouver');
    }

}


exports.signals = signals;
exports.signalServiceEvent = signalServiceEvent;
exports.createSignal = createSignal;
exports.updateSignal = updateSignal;
exports.activateSignal = activateSignal;
exports.getSignalInformations = getSignalInformation;
