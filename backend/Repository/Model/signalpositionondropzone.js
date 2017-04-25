/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('signalpositionondropzone', {
        View: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        idN: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true


        },
        PositionTop: {
            type: "DOUBLE",
            allowNull: false
        },
        PositionLeft: {
            type: "DOUBLE",
            allowNull: false
        }
    }, {
        tableName: 'signalpositionondropzone'
    });
};
