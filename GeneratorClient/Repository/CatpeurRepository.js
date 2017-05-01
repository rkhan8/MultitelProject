/**
 * Created by angem on 2017-04-28.
 */
var Sequelize = require("sequelize");
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var capteurRepositoryEvent = new EventEmitter();

var sequelize = new Sequelize('multitel', 'multitel', 'multitel', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

var capteurModel = sequelize.import(__dirname + '/Model/capteur');
capteurModel.sync();

exports.getCapteurs = function (extingSignalsId) {
    var whereClause
    if(_.isEmpty(extingSignalsId)){
        whereClause = undefined;
    }
    else{
        whereClause ={
            where:{
                idCapteur:{
                    $notIn: extingSignalsId
                }
            }
        }
    }

    capteurModel.findAll(whereClause)
        .then(function (result) {
                capteurRepositoryEvent.emit('capteurs',JSON.parse(JSON.stringify(result)) )
        }).catch(function(err){
            console.log(err);
            capteurRepositoryEvent.emit('getCapteurError', err.message);
        });
}

exports.updateCapteur = function (capteurId, category) {
    capteurModel.update({
            idCapteur: capteurId,
            category: category
        },
        {
            where: {
                idCapteur: capteurId
            }
        }).then(function(result){

    }).catch(function(err){
        console.log(err);
    })

}
exports.capteurRepositoryEvent = capteurRepositoryEvent;

