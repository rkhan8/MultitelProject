/**
 * Created by angem on 2017-03-25.
 */

var connection = require('../Repository/DBconnection')
var EventEmitter = require('events').EventEmitter;
var signalRepositoryEvent = new EventEmitter();
var _ = require('lodash');


var signalValueModel = connection.db.signalValueModel;
var signalModel = connection.db.signalModel;


exports.insertNewSignal = function (signalId, category, minVal, maxVal, unity) {
    signalModel.create({
        idN: signalId,
        Category: category,
        MinValue: minVal,
        MaxValue: maxVal,
        Unity: unity
    })
        .then(function () {
            signalRepositoryEvent.emit('signalCreated');

        })
        .catch(function (err) {
            signalRepositoryEvent.emit('signalCreateError', err.detail);
            console.log(err);

        });

}
exports.updateSignalInformations = function (signalId, category, unity, oldSignal) {
    signalModel.update(
        {
            idN: signalId,
            Category: category,
            Unity: unity
        },
        {
            where: {
                idN: oldSignal
            }
        })
        .then(function () {
            signalRepositoryEvent.emit('signalUpdated', {
                oldSignalId: oldSignal,
                signalId: signalId,
                category: category,
                unity: unity
            });
        })
        .catch(function (err) {
            signalRepositoryEvent.emit('signalUpdateError', err.detail);
            console.log(err);

        })
}
exports.insertSignalValue = function (signalId, value) {

    signalValueModel.create({
        idN: signalId,
        ValueRec: value,
        DateRec: connection.sequelize.literal('CURRENT_TIMESTAMP()')
    })
        .then(function () {
            signalRepositoryEvent.emit('valueInserted', signalId);
        })
        .catch(function (err) {
            console.log(err);
            signalRepositoryEvent.emit('signalValueCreateError', signalId);
        })
};

exports.updateSignalPosition = function (signalId, positionLeft, positionTop, view) {
    connection.db.signalpositiOndropZoneModel.upsert(
        {
            idN: signalId,
            PositionTop: positionTop,
            PositionLeft: positionLeft,
            View: view
        }).then(function () {
        signalRepositoryEvent.emit('signalPositionUdpate');
    })
        .catch(function (err) {
            console.log(err.message)
            signalRepositoryEvent.emit('errorDeleteSignalPosition', err.detail);
        })

}

exports.createSignalPosition = function (signalId, positionLeft, positionTop, view) {
    connection.db.signalpositiOndropZoneModel.upsert({
        idN: signalId,
        PositionTop: positionTop,
        PositionLeft: positionLeft,
        View: view
    })
        .then(function () {
            signalRepositoryEvent.on('signalPositionCreated')
        })
        .catch(function (err) {
            console.log(err.message);
            signalRepositoryEvent.emit('createSignalPositionError')
        })
}
exports.getSignals = function (signalId, category, minVal, maxVal, unity) {
    var whereClause = {
        idN: signalId,
        MinValue: minVal,
        MaxValue: maxVal,
        category: category,
        unity: unity
    };
    whereClause = _.pickBy(whereClause);
    connection.db.signalModel.findAll({
            where: whereClause

        }
    )
        .then(function (result) {
            signalRepositoryEvent.emit('signalsFounded', JSON.parse(JSON.stringify(result)));
        })
        .catch(function (err) {
            console.log(err);
            signalRepositoryEvent.emit('getSignalsError', signalId);
        });

}

//ne fonctionne pas correctement -- verifier la requete -- n'existe pas encore dans le service de persistance ni dans index
exports.getSignalInformations = function (signalId, category, minVal, maxVal, unity) {
    var whereClause = {
        idN: signalId,
        MinValue: minVal,
        MaxValue: maxVal,
        category: category,
        unity: unity
    };
    whereClause = _.pickBy(whereClause);
    connection.db.signalModel.findOne({
            where: whereClause, include: [{
                model: connection.db.signalBatimentModel,
                where: {
                    idN: signalId
                }, include: [{
                    model: connection.db.batimentModel
                }

                ]
            }
            ]
        }
    )
        .then(function (result) {
            signalRepositoryEvent.emit('signalsFounded', JSON.parse(JSON.stringify(result)));
        })
        .catch(function (err) {
            console.log(err);
            signalRepositoryEvent.emit('getSignalsError', signalId);
        });

}
exports.getRecordingDates = function () {
    signalValueModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT DATE(`DateRec`)'), 'DateRec']]

    }).then(function (result) {
        var dates = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalValueRecordingDateFound', _.map(dates, 'DateRec'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalValueRecordingDateError');

    });
}
exports.getSignalsCategories = function () {
    signalModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT Category'), 'Category']]

    }).then(function (result) {
        var categories = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsCategoriesFound', _.map(categories, 'Category'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsCategoriesError');

    });
}

exports.getSignalsUnity = function () {
    signalModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT Unity'), 'Unity']]

    }).then(function (result) {
        var unities = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsUnityFound', _.map(unities, 'Unity'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsUnityError');

    });
}

exports.getSignalsId = function () {
    signalModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT idN'), 'idN']]

    }).then(function (result) {
        var ids = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('signalsIdFound', _.map(ids, 'idN'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('signalsIdError');

    });
}

exports.getSignalByStatus = function (status, view) {
    connection.db.signalModel.findAll({
        include: [

            {
                model: connection.db.signalStatusModel,
                where: {
                    status: status
                }
            },

            {
                model: connection.db.signalpositiOndropZoneModel,
                where: {
                    view: view
                }
            }

        ]
    }).then(function (result) {
        signalRepositoryEvent.emit('signalsByStatusFounded', JSON.parse(JSON.stringify(result)));
    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('getSignalDisplayedErr', err.detail);
    })
};

exports.deleteSignalPosition = function (signalId, view) {
    connection.db.signalpositiOndropZoneModel.destroy({
        where: {
            idN: signalId,
            view: view
        }
    }).then(function () {
        signalRepositoryEvent.emit('signalPositionDeleted')
    })
        .catch(function (err) {
            console.log(err.message)
            signalRepositoryEvent.emit('errorDeleteSignalPosition', err.detail);
        });
}


exports.updateSignalStatus = function (signalId, newStatus) {
    connection.db.signalStatusModel.update(
        {status: newStatus},
        {
            where: {
                idN: signalId
            }
        }
    ).then(function () {
        signalRepositoryEvent.emit('signalStatusUpdated')
    })
        .catch(function (err) {
            signalRepositoryEvent.emit('errorUpdateSignalStatus', err.detail);
        });
}

exports.getNotDiplayedSignalsId = function () {
    connection.db.signalStatusModel.findAll({
        attributes: ['idN'],
        where: {
            status: 0
        }
    }).then(function (result) {
        var ids = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('notDisplayedSignalsFound', _.map(ids, 'idN'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('searchNotDisplayedSignalsError', err.detail);

    });

}


exports.getSignalsValues = function (signalId, category, unity, startDate, endDate) {
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
    if (_.isEmpty(whereClause1))
        whereClause1 = undefined;

    whereClause1 = _.pickBy(whereClause1);
    signalValueModel.findAll({
        where: whereClause2,
        include: [{
            model: signalModel,
            where: whereClause1
        }
        ]
    }).then(function (result) {
        signalRepositoryEvent.emit('signalValueFound', JSON.parse(JSON.stringify(result)));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('searchSignalValueError', signalId);

    });


}


exports.signalRepositoryEvent = signalRepositoryEvent;






