/**
 * Created by angem on 2017-02-18.
 */

var Signal = require('../Model/Signal');

var ArrayList = require('arraylist');
var EventEmitter = require('events').EventEmitter;
var signals =  new ArrayList;
var newValueEvent = new EventEmitter();

exports.createSignal =  function (req, res){
    var signal = new Signal (req.min,req.max,req.variance);
    signals.add(signal);
}

exports.activateSignal = function(req, res){
    signals.get(0).on('newValueHasGenerate',function(value){ newValueEvent.emit('newValueHasGenerate', value)});
    setInterval(function(){signals.get(0).generateUniformValue()}, 1000);

}

exports.signals = signals;
exports.newValueEvent = newValueEvent;