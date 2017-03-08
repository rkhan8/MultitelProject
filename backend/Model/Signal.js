/**
 * Created by angem on 2017-02-10.
 */

var random = require('random-js')();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Signal(generatorId, min, max, variance) {
    this.generatorId = generatorId;
    this.min = min;
    this.max = max;
    this.variance = variance;
    this.currentValue = undefined;
};


Signal.prototype.generateUniformValue = function () {
    if(this.currentValue == undefined){
        this.currentValue = generateRandomValue(this.min, this.max);
        return {
            generatorId: this.generatorId,
            value: this.currentValue
        }
    }
    else{
        var minValue = this.currentValue - this.variance;
        var maxValue = this.currentValue + this.variance;
        if (minValue < this.min) minValue = 0;
        if (maxValue > this.max) maxValue = this.max;
        this.currentValue = generateRandomValue(minValue, maxValue);
        return {
            generatorId: this.generatorId,
            value: this.currentValue
        }
    }
};

Signal.prototype.generateBinaryValue = function(){
    if(this.currentValue == undefined){
        this.currentValue = 0;
        this.emit('newValueHasGenerate', this.currentValue);
    }
    else{
        this.currentValue = Math.abs(this.currentValue - 1);
        this.emit('newValueHasGenerate', this.currentValue);

    }
};


util.inherits(Signal, EventEmitter);
module.exports = Signal;

var generateRandomValue = function (min, max) {
    var value = parseFloat(random.real(min, max, true));
    return parseFloat(value.toFixed(2));
};
