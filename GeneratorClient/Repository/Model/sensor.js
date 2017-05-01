/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sensor', {
    idSensor: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    valeurMin: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    valeurMax: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    categorie: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'sensor'
  });
};
