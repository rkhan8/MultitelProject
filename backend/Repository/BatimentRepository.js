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
exports.searchCompagnies= function(){
    mySqlCOnnection.db.batimentModel.findAll({
        attributes:[[mySqlCOnnection.sequelize.literal('DISTINCT Compagnie'), 'Compagnie']]
    }).then(function (result) {
        var compagnies = JSON.parse(JSON.stringify(result));
        signalRepositoryEvent.emit('batimentCompagniesFound',_.map(compagnies, 'compagnie'));

    }).catch(function (err) {
        console.log(err);
        signalRepositoryEvent.emit('batimentCompagniesError');

    });
};
exports.searchCompagnieBatimentsName = function(compagnieName){

  mySqlCOnnection.db.batimentModel.findAll({
      attributes:[[mySqlCOnnection.sequelize.literal('DISTINCT NomBatiment'), 'NomBatiment']],
      where: {
          Compagnie: compagnieName

      }
  }).then(function(result){
      var batiments = JSON.parse(JSON.stringify(result));
    signalRepositoryEvent.emit('batimentCompagniesFound',_.map(batiments, 'NomBatiment'));
  })
};
exports.batimentRepositoryEvent = batimentRepositoryEvent;