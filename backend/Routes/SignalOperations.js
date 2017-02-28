/**
 * Created by angem on 2017-02-18.
 */

var Signal = require('../Model/Signal');
var random = require('random-js')();

var ArrayList = require('arraylist');
var EventEmitter = require('events').EventEmitter;
var signals =  new ArrayList;
var newValueEvent = new EventEmitter();

function createSignal (values){
    var signal = new Signal (values.valMin,values.valMax,5);
    signals.add(signal);
}

function activateSignal(){
    signals.get(0).on('newValueHasGenerate',function(value){ newValueEvent.emit('newValueHasGenerate', value)});
    setInterval(function(){signals.get(0).generateUniformValue()}, 1000);

}



/*odule.exports =
{
  getobj:function Values(min, max, callback)
  {

    var value = random.real(min, max, true);
    value = parseFloat(value).toFixed(2);


    callback(null, value);
  }
}
*/
exports.signals = signals;
exports.newValueEvent = newValueEvent;
exports.createSignal = createSignal;
exports.activateSignal = activateSignal;
