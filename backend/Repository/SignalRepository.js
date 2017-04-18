/**
 * Created by angem on 2017-03-25.
 */

var mySqlCOnnection = require ('../Repository/DBconnection')
var EventEmitter = require('events').EventEmitter;
var signalRepositoryEvent = new EventEmitter();
var _ = require('lodash');




var signalValueModel = mySqlCOnnection.DB.import(__dirname + '/Model/SignalValue');
var signalModel = mySqlCOnnection.DB.import(__dirname + '/Model/Signal');
signalModel.hasMany(signalValueModel, {foreignKey: 'idN'});
signalValueModel.belongsTo(signalModel, {foreignKey: 'idN'});
signalModel.sync();
signalValueModel.sync();


exports.insertNewSignal = function(signalId, category, minVal, maxVal, unity) {
    signalModel.create({
        idN: signalId,
        Category: category,
        MinValue: minVal,
        MaxValue: maxVal,
        Unity: unity
    })
        .then(function () {
            signalRepositoryEvent.emit('signalCreated', {
                signalId: signalId,
                category: category,
                valMin: minVal,
                valMax: maxVal
            });

        })
        .catch(function (err) {
            signalRepositoryEvent.emit('signalCreateError', signalId);
            console.log(err);

        });

}
exports.insertSignalValue = function(signalId, value) {

    signalValueModel.create({
        idN: signalId,
        ValueRec: value,
        DateRec: mySqlCOnnection.DB.literal('CURRENT_TIMESTAMP()')
    })
        .then(function() {
            signalRepositoryEvent.emit('valueInserted', signalId);
        })
        .catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalValueCreateError', signalId);
    })
};
exports.getSignals = function(signalId, category, minVal, maxVal, unity) {
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
            signalRepositoryEvent.emit('signalsFounded', JSON.parse(JSON.stringify(result)));
        })
        .catch(function () {
            console.log(err);
            signalRepositoryEvent.emit('getSignalsError', signalId);
        });

}
exports.getRecordingDates = function(){
    signalValueModel.findAll({
        attributes:[[mySqlCOnnection.DB.literal('DISTINCT DATE(`DateRec`)'), 'DateRec']]

    }).then(function (result) {
        var dates = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalValueRecordingDateFound',_.map(dates, 'DateRec') );

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalValueRecordingDateError');

    });
}
exports.getSignalsCategories = function(){
    signalModel.findAll({
        attributes:[[mySqlCOnnection.DB.literal('DISTINCT Category'), 'Category']]

    }).then(function (result) {
        var categories = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsCategoriesFound',_.map(categories, 'Category'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsCategoriesError');

    });
}

exports.getSignalsUnity = function(){
    signalModel.findAll({
        attributes:[[mySqlCOnnection.DB.literal('DISTINCT Unity'), 'Unity']]

    }).then(function (result) {
        var unities = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsUnityFound', _.map(unities,'Unity'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsUnityError');

    });
}

exports.getSignalsId = function(){
    signalModel.findAll({
        attributes:[[mySqlCOnnection.DB.literal('DISTINCT idN'), 'idN']]

    }).then(function (result) {
        var ids = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsIdFound', _.map(ids,'idN'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsIdError');

    });
}


 exports.getSignalValues = function(signalId, category, unity, startDate, endDate) {
    var whereClause2;
    var whereClause1 = {
        idN: signalId,
        category: category,
        unity: unity
    };
    var date = {
        $lte: startDate,
        $gte: endDate
    };
    date = _.pickBy(date);
    if (!_.isEmpty(date)) {
        whereClause2 = {
            dateRec: date
        };
    }
    if(_.isEmpty(whereClause1))
        whereClause1 = undefined;

    whereClause1 = _.pickBy(whereClause1);
    signalModel.find({
        where: whereClause1,
        include: [{
            model: signalValueModel,
            where: whereClause2
        }
        ]
    })
        .then(function (result) {
            signalRepositoryEvent.emit('signalValueFound', JSON.parse(JSON.stringify(result)));

        }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('searchSignalValueError', signalId);

    });


}


exports.SignalRepositoryEvent = signalRepositoryEvent;






