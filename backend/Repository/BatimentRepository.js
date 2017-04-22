/**
 * Created by angem on 2017-04-22.
 */

var mySqlCOnnection = require('../Repository/DBconnection')
var EventEmitter = require('events').EventEmitter;
var batimentRepositoryEvent = new EventEmitter();
var _ = require('lodash');


exports.ajouterBatiment = function (Compagnie, NomBatiment, Nbetages, Adresse, CodePostal, Numero) {
    mySqlCOnnection.db.batimentModel.create({
        Compagnie: Compagnie,
        NomBatiment: NomBatiment,
        NbEtages: Nbetages,
        Adresse: Adresse,
        CodePostal: CodePostal,
        Numero: Numero
    })
        .then(function(){
            batimentRepositoryEvent.emit('batimentAjouterOk');
        })
        .catch(function (err) {
            batimentRepositoryEvent.emit('ajouterBatimentError', err.detail);
            console.log(err);
        });

}
exports.batimentRepositoryEvent = batimentRepositoryEvent;