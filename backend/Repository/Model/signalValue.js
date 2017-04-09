/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('signalvalue', {

        idN: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'signals',
                key: 'idN'
            }
        },
        ValueRec: {
            type: "DOUBLE",
            allowNull: false
        },
        DateRec: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'signalvalue'
    });
};
