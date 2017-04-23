/**
 * Created by angem on 2017-04-11.
 */
var Sequelize = require("sequelize");

function DBConnection(){

    this.db = {};
    this.sequelize =  new Sequelize('multitel', 'multitel', 'multitel', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    });

    this.db['batimentModel'] = this.sequelize.import(__dirname + '/Model/Batiment');
    this.db['signalBatimentModel'] = this.sequelize.import(__dirname + '/Model/signalBatiment');
    this.db['signalModel'] = this.sequelize.import(__dirname + '/Model/Signal');
    this.db['signalpositiOndropZoneModel'] = this.sequelize.import(__dirname + '/Model/signalpositionondropzone');
    this.db['signalValueModel'] = this.sequelize.import(__dirname + '/Model/SignalValue');
    this.db['activeSignalsModel'] = this.sequelize.import(__dirname + '/Model/activessignals')

    this.db.batimentModel.hasMany(this.db.signalBatimentModel,{foreignKey: 'batimentId'});
    this.db.signalModel.hasMany(this.db.signalBatimentModel, {foreignKey: 'idN'});
    this.db.signalModel.hasMany(this.db.signalpositiOndropZoneModel,{foreignKey: 'idN'});
    this.db.signalModel.hasMany(this.db.signalValueModel, {foreignKey: 'idN'});
    this.db.signalModel.hasMany(this.db.activeSignalsModel,{foreignKey: 'idN'})
    this.db.signalBatimentModel.belongsTo(this.db.batimentModel,{foreignKey: 'batimentId'});
    this.db.signalBatimentModel.belongsTo(this.db.signalModel,{foreignKey: 'idN'});
    this.db.signalpositiOndropZoneModel.belongsTo(this.db.signalModel,{foreignKey: 'idN'});
    this.db.signalValueModel.belongsTo(this.db.signalModel, {foreignKey: 'idN'});
    this.db.activeSignalsModel.belongsTo(this.db.signalModel, {foreignKey: 'idN'});


    this.db.batimentModel.sync();
    this.db.signalBatimentModel.sync();
    this.db.signalModel.sync();
    this.db.signalValueModel.sync();
    this.db.signalpositiOndropZoneModel.sync();
    this.db.activeSignalsModel.sync();
}

DBConnection.instance = null;
DBConnection.getInstance = function(){
    if(this.instance === null){
        this.instance = new DBConnection();
    }
    return this.instance;
}

module.exports = DBConnection.getInstance();