/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalbatiment', {
    Etage: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    idN: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'signals',
        key: 'idN'
      }
    },
    Compagnie: {
      type: DataTypes.STRING(300),
      allowNull: false,
      references: {
        model: 'batiment',
        key: 'Compagnie'
      }
    },
    NomBatiment: {
      type: DataTypes.STRING(300),
      allowNull: false,
      references: {
        model: 'batiment',
        key: 'NomBatiment'
      }
    }
  }, {
    tableName: 'signalbatiment'
  });
};
