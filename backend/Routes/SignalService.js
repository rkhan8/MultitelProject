/**
 * Created by angem on 2017-02-18.
 */

var Signal = require('../Model/Signal');
var random = require('random-js')();

var ArrayList = require('arraylist');
var EventEmitter = require('events').EventEmitter;
var signals =  new ArrayList;
var newValueEvent = new EventEmitter();
newValueEvent.setMaxListeners(0);
var interval;

function createSignal (values){
    var signal = new Signal (values.generatorId,values.category,values.valMin,values.valMax);
    var index = searchSignalById(values.generatorId);
    if(index === -1)
        signals.add(signal);
    else{
        newValueEvent.emit('errorGeneratorId', 'Ce generateur existe deja. Choisissez un autre nom de generateur');
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
   // signals.get(signals.length -1).on('newValueHasGenerate',function(values){
    //    newValueEvent.emit('newValueHasGenerate', values)});
    clearInterval(interval);
    interval = setInterval(function(){
        for( i= 0; i< signals.length; i++){
            var values = signals.get(i).generateValue();
            newValueEvent.emit('newValueHasGenerate', values);
        }

    },500);

}

exports.signals = signals;
exports.newValueEvent = newValueEvent;
exports.createSignal = createSignal;
exports.activateSignal = activateSignal;
