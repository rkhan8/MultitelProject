/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalvalue', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idN: {
      type: DataTypes.STRING(255),
      allowNull: false

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
