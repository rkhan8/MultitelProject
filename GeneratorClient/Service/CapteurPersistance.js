/**
 * Created by angem on 2017-04-28.
 */
var capteurRepository  = require('../Repository/CatpeurRepository');
var EventEmitter = require('events').EventEmitter;
var persistanceEvent = new EventEmitter();


exports.getCapteurs = function(extingSignalsId){
    capteurRepository.getCapteurs(extingSignalsId);
}
exports.updateCapteur = function(capteurId, category){
    capteurRepository.updateCapteur(capteurId, category)
}

capteurRepository.capteurRepositoryEvent.on('capteurs', function(capteurs){
    persistanceEvent.emit('capteurs', capteurs)
});
capteurRepository.capteurRepositoryEvent.on('getCapteurError', function(message){
    persistanceEvent.emit('error',message);
});

exports.persistanceEvent = persistanceEvent;

