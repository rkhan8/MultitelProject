/**
 * Created by angem on 2017-02-10.
 */

var Generator = require('../DomaineModel/Generator');


function Signal(signalId, category, min, max, unity) {
    this._signalId = signalId;
    this._category = category;
    this._unity = unity;
    this._generator = new Generator(category, min, max);
}


Signal.prototype.updateSignal = function (signalId, category, min, max) {
    this._signalId = signalId;
    this._category = category;
    this._generator = new Generator(category, min, max);
};
Signal.prototype.nextValue = function () {
    return {
        value: this._generator.getNextValue(),
        signalId: this._signalId
    }
};
Signal.prototype.getSignalID = function () {
    return this._signalId;
};


Signal.prototype.getCategory = function () {
    return this._category;
};
Signal.prototype.getSignalInformations = function () {
    return {

       signalId: this._signalId,
        category: this._category,
        unity: this._unity
    }
};


module.exports = Signal;




