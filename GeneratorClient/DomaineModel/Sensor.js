/**
 * Created by angem on 2017-02-10.
 */

var Generator = require('../DomaineModel/Generator');


function Sensor(sensorId, category, min, max, unity) {
    this._sensorId = sensorId;
    this._category = category;
    this._unity = unity;
    this._generator = new Generator(category, min, max);
}


Sensor.prototype.updateSensor = function (signalId, category, unity) {
    this._sensorId = signalId;
    this._category = category;
    this._unity = unity;
};
Sensor.prototype.nextValue = function () {
    return {
        value: this._generator.getNextValue(),
        sensorId: this._sensorId
    }
};
Sensor.prototype.getSignalID = function () {
    return this._sensorId;
};


Sensor.prototype.getCategory = function () {
    return this._category;
};
Sensor.prototype.getSensorInformations = function () {
    return {

       sensorId: this._sensorId,
        category: this._category,
        unity: this._unity
    }
};


module.exports = Sensor;




