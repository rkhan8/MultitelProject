/**
 * Created by angem on 2017-02-10.
 */

var random = require('random-js')();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Generator = function (min, max, variance) {
    var self = this;


    this.generateValue = function () {
        var value = generateRandomValue(min, max);
        self.emit('newValueHasGenerate', value);
        while (true) {
            var minValue = value - variance;
            var maxValue = value + variance;
            if (minValue < min) minValue = 0;
            if (maxValue > max) maxValue = max;
                value = generateRandomValue(minValue, maxValue);
            self.emit('newValueHasGenerate', value);
        }
    };

};
util.inherits(Generator, EventEmitter);
module.exports = Generator;


var generateRandomValue = function (min, max) {
    var value = random.real(min, max, true);
    return parseFloat (value.toFixed(2));
};


