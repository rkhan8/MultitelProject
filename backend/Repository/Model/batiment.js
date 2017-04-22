/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('batiment', {
    NbEtages: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Compagnie: {
      type: DataTypes.STRING(300),
      allowNull: false,
      primaryKey: true
    },
    NomBatiment: {
      type: DataTypes.STRING(300),
      allowNull: false,
      primaryKey: true
    },
    Adresse: {
      type: DataTypes.STRING(600),
      allowNull: false
    },
    CodePostal: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Numero: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'batiment'
  });
};
