/**
 * Created by angem on 2017-04-11.
 */
var random = require('random-js')();

function Generator(category, min, max) {
    this._variance = 2;
    this._currentValue = undefined;
    this._min = min;
    this._max = max;
    this._generatorFunction = setupGenerator(category);
}

Generator.prototype.getMin = function(){
    return this._min;
};
Generator.prototype.getMax = function(){
    return this._max;
};

Generator.prototype.getNextValue= function(){
    this._currentValue = this._generatorFunction();
    return this._currentValue;
}

function setupGenerator(category) {
    switch (category) {
        case "binary" :
            return generateBinaryValue;
        case "analog" :
            return generateRealValue;

    }

}


var generateRealValue = function () {
    if (this._currentValue == undefined) {
        this._currentValue = generateRandomValue(this._min, this._max);
        return this._currentValue

    }
    else {
        var minValue = this._currentValue - this._variance;
        var maxValue = this._currentValue + this._variance;
        if (minValue < this._min) minValue = this._min;
        if (maxValue > this._max) maxValue = this._max;
        this._currentValue = generateRandomValue(parseFloat(minValue), maxValue);
        return this._currentValue

    }
};

var generateBinaryValue = function () {
    return Number(random.bool());
};

var generateRandomValue = function (min, max) {
    var value = parseFloat(random.real(parseFloat(min), parseFloat(max), true));
    return parseFloat(value.toFixed(2));
};

module.exports = Generator;
