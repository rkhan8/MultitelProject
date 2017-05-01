/**
 * Created by angem on 2017-04-28.
 */
var Sequelize = require("sequelize");
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var sensorRepositoryEvent = new EventEmitter();

var sequelize = new Sequelize('multitel', 'multitel', 'multitel', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

var sensorModel = sequelize.import(__dirname + '/Model/sensor');
sensorModel.sync();

exports.getAllSensor = function(){
    sensorModel.findAll()
        .then(function(result){
            sensorRepositoryEvent.emit('sensors',JSON.parse(JSON.stringify(result)) )
        })
        .catch(function(err){
            console.log(err);
            sensorRepositoryEvent.emit('getSensorError', err.message);
        })
}

exports.getNewSensors = function (extingSignalsId) {
    var whereClause
    if(_.isEmpty(extingSignalsId)){
        whereClause = undefined;
    }
    else{
        whereClause ={
            where:{
                idSensor:{
                    $notIn: extingSignalsId
                }
            }
        }
    }

    sensorModel.findAll(whereClause)
        .then(function (result) {
                sensorRepositoryEvent.emit('newSensors',JSON.parse(JSON.stringify(result)) )
        }).catch(function(err){
            console.log(err);
            sensorRepositoryEvent.emit('getNewSensorError', err.message);
        });
}

exports.updateSensor = function (sensorId, category) {
    sensorModel.update({
            idSensor: sensorId,
            category: category
        },
        {
            where: {
                idSensor: sensorId
            }
        }).then(function(result){

    }).catch(function(err){
        console.log(err);
    })

}
exports.sensorRepositoryEvent = sensorRepositoryEvent;

