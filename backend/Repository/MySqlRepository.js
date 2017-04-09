/**
 * Created by angem on 2017-03-25.
 */

var Sequelize = require("sequelize");
var EventEmitter = require('events').EventEmitter;
var mySqlRepositoryEvent = new EventEmitter();
var _ = require('lodash');


var sequelize = new Sequelize('multitel', 'multitel', 'multitel', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

var signalValueModel = sequelize.import(__dirname + '/Model/SignalValue');
var signalModel = sequelize.import(__dirname + '/Model/Signal');
signalModel.hasMany(signalValueModel, {foreignKey: 'idN'});
signalValueModel.belongsTo(signalModel, {foreignKey: 'idN'});
signalModel.sync();
signalValueModel.sync();


function insertNewSignal(signalId, category, minVal, maxVal, unity) {
    signalModel.create({
        idN: signalId,
        Category: category,
        MinValue: minVal,
        MaxValue: maxVal,
        Unity: unity
    })
        .then(function () {
            mySqlRepositoryEvent.emit('signalCreated', {
                signalId: signalId,
                category: category,
                valMin: minVal,
                valMax: maxVal
            });

        })
        .catch(function (err) {
            mySqlRepositoryEvent.emit('signalCreateError', signalId);
            console.log(err);

        });

}
function insertSignalValue(signalId, value, date) {

    signalValueModel.create({
        idN: signalId,
        ValueRec: value,
        DateRec: date,
    }).catch(function (err) {
        console.log(err);
        mySqlRepositoryEvent.emit('signalValueCreateError', signalId);
    })
}
function getSignals(signalId, category, minVal, maxVal, unity) {
    var whereClause = {
        idN: signalId,
        MinValue: minVal,
        MaxValue: maxVal,
        category: category,
        unity: unity
    };
    whereClause = _.pickBy(whereClause);
    signalModel.findAll({where: whereClause})
        .then(function (result) {
            mySqlRepositoryEvent.emit('signalsFounded', JSON.parse(JSON.stringify(result)));
        })
        .catch(function () {
            console.log(err);
            mySqlRepositoryEvent.emit('getSignalsError', signalId);
        });

}

function getDistinctDateOfRecordingSignalValue(){
    signalValueModel.findAll({
        attributes:[Sequelize.literal('DISTINCT `DateRec`'), 'DateRec']

    }).then(function (result) {
        mySqlRepositoryEvent.emit('signalValueRecordingDateFound', JSON.parse(JSON.stringify(result)));

    }).catch(function (err) {
        console.log(err);
        mySqlRepositoryEvent.emit('signalValueRecordingDateError', signalId);

    })
}
function getSignalValues(signalId, category, unity, startDate, endDate) {
    var whereClause2;
    var whereClause1 = {
        idN: signalId,
        category: category,
        unity: unity
    };
    var date = {
        $lte: startDate,
        $gte: endDate
    }
    date = _.pickBy(date);
    if (!_.isEmpty(date)) {
        whereClause2 = {
            dateRec: date
        };
    }

    whereClause1 = _.pickBy(whereClause1);
    signalModel.find({
        where: whereClause1, include: [{
            model: signalValueModel,
            where: whereClause2
        }
        ]
    })
        .then(function (result) {
            mySqlRepositoryEvent.emit('signalValueFound', JSON.parse(JSON.stringify(result)));

        }).catch(function (err) {
        console.log(err);
        mySqlRepositoryEvent.emit('searchSignalValueError', signalId);

    });


}
exports.mySqlRepositoryEvent = mySqlRepositoryEvent;
exports.getSignalValues = getSignalValues;
exports.insertNewSignal = insertNewSignal;
exports.insertSignalValue = insertSignalValue;
exports.getSignalFromDB = getSignals;
exports.getDistinctDateOfRecordingSignalValue = getDistinctDateOfRecordingSignalValue;

