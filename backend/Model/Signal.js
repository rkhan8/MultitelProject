/**
 * Created by angem on 2017-02-10.
 */

var random = require('random-js')();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Signal(min, max, variance) {
    this.min = min;
    this.max = max;
    this.variance = variance;
    this.currentValue = -1;
};


Signal.prototype.generateUniformValue = function () {
    if(this.currentValue == -1){
        this.currentValue = generateRandomValue(this.min, this.max);
        this.emit('newValueHasGenerate', this.currentValue);
    }
    else{
        var minValue = this.currentValue - this.variance;
        var maxValue = this.currentValue + this.variance;
        if (minValue < this.min) minValue = 0;
        if (maxValue > this.max) maxValue = this.max;
        this.currentValue = generateRandomValue(minValue, maxValue);
        this.emit('newValueHasGenerate', this.currentValue);
    }


};


util.inherits(Signal, EventEmitter);
module.exports = Signal;

var generateRandomValue = function (min, max) {
    var value = parseFloat(random.real(min, max, true));
    return parseFloat(value.toFixed(2));
};
