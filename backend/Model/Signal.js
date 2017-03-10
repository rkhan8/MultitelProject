/**
 * Created by angem on 2017-02-10.
 */

var random = require('random-js')();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Signal(generatorId, category, min, max) {
    this._generatorId = generatorId;
    this._min = min;
    this._max = max;
    this._variance = 2;
    this._currentValue = undefined;
    this._category = category;
    this._generator = setupGenerator(category);
};

Signal.prototype.UpdateSignal = function (generatorId, category,min, max){
    setupSignal(generatorId, category,min, max);
}
Signal.prototype.generateValue = function(){
    return this._generator();
}
Signal.prototype.getGeneratorID = function(){
    return this._generatorId;
}
Signal.prototype.getVariance = function(){
    return this._variance;
}
Signal.prototype.getMin = function(){
    return this._min;
}
Signal.prototype.getMax = function(){
    return this._max;
}
Signal.prototype.getCategory = function(){
    return this._category;
}


function setupSignal(generatorId,category, min, max) {
    this._generatorId = generatorId;
    this._min = min;
    this._max = max;
    this._currentValue = undefined;
    this._category = category;
    this._generator = setupGenerator(category);
}
 function setupGenerator(category){
    switch (category){
        case "binary" :
            return generateBinaryValue;
        case "real" :
            return generateRealValue;
    }

}

var generateRealValue= function () {
    if(this._currentValue == undefined){
        this._currentValue = generateRandomValue(this._min, this._max);
        return {
            generatorId: this._generatorId,
            value: this._currentValue
        }
    }
    else{
        var minValue = this._currentValue - this._variance;
        var maxValue = this._currentValue + this._variance;
        if (minValue < this._min) minValue = this._min;
        if (maxValue > this._max) maxValue = this._max;
        this._currentValue = generateRandomValue(parseFloat(minValue), maxValue);
        return {
            generatorId: this._generatorId,
            value: this._currentValue
        }
    }
};

var generateBinaryValue = function(){
    if(this._currentValue == undefined){
        this._currentValue = 0;
        return {
            generatorId: this._generatorId,
            value: this._currentValue
        }
    }
    else{
        this._currentValue = Math.abs(this._currentValue - 1);
        return {
            generatorId: this._generatorId,
            value: this._currentValue
        }
    }
};


util.inherits(Signal, EventEmitter);
module.exports = Signal;

var generateRandomValue = function (min, max) {
    var value = parseFloat(random.real(parseFloat(min), parseFloat(max), true));
    return parseFloat(value.toFixed(2));
};


