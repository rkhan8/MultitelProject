/**
 * Created by angem on 2017-04-11.
 */
var Sequelize = require("sequelize");

function DBConnection(){
    this.DB =  new Sequelize('multitel', 'multitel', 'multitel', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    });
}
DBConnection.instance = null;
DBConnection.getInstance = function(){
    if(this.instance === null){
        this.instance = new DBConnection();
    }
    return this.instance;
}

module.exports = DBConnection.getInstance();