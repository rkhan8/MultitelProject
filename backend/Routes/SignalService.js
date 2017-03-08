/**
 * Created by angem on 2017-02-18.
 */

var Signal = require('../Model/Signal');
var random = require('random-js')();

var ArrayList = require('arraylist');
var EventEmitter = require('events').EventEmitter;
var signals =  new ArrayList;
var newValueEvent = new EventEmitter();
var interval;

function createSignal (values){
    var signal = new Signal (values.generatorNumber,values.valMin,values.valMax,5);
    signals.add(signal);
}

function activateSignal(){
   // signals.get(signals.length -1).on('newValueHasGenerate',function(values){
    //    newValueEvent.emit('newValueHasGenerate', values)});
    clearInterval(interval);
    interval = setInterval(function(){
        for( i= 0; i< signals.length; i++){
            var values = signals.get(i).generateUniformValue()
            newValueEvent.emit('newValueHasGenerate', values)
        }

    },1000);

}

exports.signals = signals;
exports.newValueEvent = newValueEvent;
exports.createSignal = createSignal;
exports.activateSignal = activateSignal;
