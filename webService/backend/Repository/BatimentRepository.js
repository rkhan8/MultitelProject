/**
 * Created by angem on 2017-04-22.
 */

var connection = require('../Repository/DBconnection');
var EventEmitter = require('events').EventEmitter;
var batimentRepositoryEvent = new EventEmitter();
var _ = require('lodash');


exports.ajouterBatiment = function (Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero) {
    var data = {
        Compagnie: Compagnie,
        NomBatiment: NomBatiment,
        NbEtages: Nbetages,
        Adresse: Adresse,
        CodePostal: CodePostal,
        Numero: Numero
    };
    data = _.pickBy(data);
    connection.db.batimentModel.create(data)
        .then(function () {
            batimentRepositoryEvent.emit('batimentAjouterOk');
        })
        .catch(function (err) {
            batimentRepositoryEvent.emit('ajouterBatimentError', err.message);
            console.log(err);
        });

};
exports.updateBatimentInformations = function (batimentId, Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero) {

    connection.db.batimentModel.update({
        Compagnie: Compagnie,
        NomBatiment: NomBatiment,
        Adresse: Adresse,
        CodePostal: CodePostal,
        NbEtages: Nbetages,
        Numero: Numero

    }, {
        where: {
            batimentId: batimentId
        }
    })
        .then(function () {
            batimentRepositoryEvent.emit('batimentUpdated')
        })
        .catch(function (err) {
            console.log(err);
            batimentRepositoryEvent.emit('errorBatimentUpdate', err.message);
        })
};

exports.deleteBatiment = function (batimentId) {


    connection.db.batimentModel.destroy({
        where: {
            batimentId: batimentId
        }
    }).then(function () {
        batimentRepositoryEvent.emit('batimentDeleted');
    }).catch(function () {
        console.log(err);
        batimentRepositoryEvent.emit('errorDeleteBatiment', err.message);
    })
};
exports.getCompagnies = function () {
    connection.db.batimentModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT Compagnie'), 'Compagnie']]
    }).then(function (result) {
        var compagnies = JSON.parse(JSON.stringify(result));
        batimentRepositoryEvent.emit('compagniesFound', _.map(compagnies, 'Compagnie'));

    }).catch(function (err) {
        console.log(err);
        batimentRepositoryEvent.emit('searchCompagniesError', err.message);

    });
};

exports.getBatimentSignals = function (compagnie, batiment, numeroEtage) {
    var whereClause1 = {
        Compagnie: compagnie,
        NomBatiment: batiment
    };
    var whereClause2 = {
        Etage: numeroEtage
    };
    whereClause1 = _.pickBy(whereClause1);
    whereClause2 = _.pickBy(whereClause2);
    connection.db.batimentModel.findAll({
        where: whereClause1,
        include: [{
            model: connection.db.signalBatimentModel,
            where: whereClause2,
            include: [{
                model: connection.db.signalModel,
                include: [{
                    model: connection.db.signalpositiOndropZoneModel,
                    where: {
                        view: 'rechercheSignal'
                    }
                }]
            }]
        }

        ]
    }).then(function (result) {
        var res = JSON.parse(JSON.stringify(result));
        batimentRepositoryEvent.emit('batimentSignalInformations', res);
    })
        .catch(function (err) {
            console.log(err);
            batimentRepositoryEvent.emit('getBatimentSignalInformationsError', err.message);
        })
};
exports.getCompagnieBatimentsName = function (compagnieName) {

    connection.db.batimentModel.findAll({
        attributes: [[connection.sequelize.literal('DISTINCT NomBatiment'), 'NomBatiment']],
        where: {
            Compagnie: compagnieName

        }
    }).then(function (result) {
        var batiments = JSON.parse(JSON.stringify(result));
        batimentRepositoryEvent.emit('batimentsFound', _.map(batiments, 'NomBatiment'));
    }).catch(function (err) {
        console.log(err);
        batimentRepositoryEvent.emit('searchBatimentsError', err.message);
    })
};

exports.getBatimentsInformations = function (compagnie, nomBatiment) {
    var whereClause = {
        Compagnie: compagnie,
        NomBatiment: nomBatiment
    };
    whereClause = _.pickBy(whereClause);
    connection.db.batimentModel.findAll({
        where: whereClause
    })
        .then(function (result) {
            batimentRepositoryEvent.emit('batimentInfosFound', JSON.parse(JSON.stringify(result)));
        })
        .catch(function (err) {
            console.log(err.message);
            batimentRepositoryEvent.emit('searchBatimentInfosError', err.message);
        });
};
exports.createSignalBatimentInformations = function (signalId, compagnie, nomBatiment, Etage) {

    connection.db.batimentModel.findOne({
        where: {
            Compagnie: compagnie,
            NomBatiment: nomBatiment
        }
    })
        .then(function (result) {
            var batiment = JSON.parse(JSON.stringify(result));
            connection.db.signalBatimentModel.create({
                batimentId: batiment.batimentId,
                idN: signalId,
                Etage: Etage
            }).then(function () {
                batimentRepositoryEvent.emit('signalBatimentInfosCreated');
            })
        })
        .catch(function (err) {
            console.log(err.message);
            batimentRepositoryEvent.emit('createBatimentInfosError', err.message);
        });
};

exports.updateSignalBatimentInformations = function (signalId, compagnie, nomBatiment, Etage) {

    connection.db.batimentModel.findOne({
        where: {
            Compagnie: compagnie,
            NomBatiment: nomBatiment
        }
    })
        .then(function (result) {
            var batiment = JSON.parse(JSON.stringify(result))
            connection.db.signalBatimentModel.update(
                {
                    batimentId: batiment.batimentId,
                    idN: signalId,
                    Etage: Etage
                }
                , {
                    where: {
                        idN: signalId
                    }
                }
            ).then(function () {
                batimentRepositoryEvent.emit('signalBatimentInfosUpdated');
            })
        })
        .catch(function (err) {
            console.log(err.message);
            batimentRepositoryEvent.emit('batimentInfosUpdatedError', err.message);
        });
};

exports.batimentRepositoryEvent = batimentRepositoryEvent;