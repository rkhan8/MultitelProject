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
        primaryKey: true

    },
    batimentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'signalbatiment'
  });
};
