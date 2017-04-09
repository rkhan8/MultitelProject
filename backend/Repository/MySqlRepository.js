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
function searchSignalById(signalId) {
    signalModel.find({where: {idN: signalId}})
        .then(function (signal) {
            mySqlRepositoryEvent.emit('found', signal.dataValues);
        })
        .catch(function () {
            console.log(err);
            mySqlRepositoryEvent.emit('searchSignalError', signalId);
        });

}
function searchSignalValues(signalId, category, unity, startDate, endDate) {
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
    if(!_.isEmpty(date)){
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

    })


}
exports.mySqlRepositoryEvent = mySqlRepositoryEvent;
exports.searchSignalValues = searchSignalValues;
exports.insertNewSignal = insertNewSignal;
exports.insertSignalValue = insertSignalValue;
exports.searchSignalById = searchSignalById;

