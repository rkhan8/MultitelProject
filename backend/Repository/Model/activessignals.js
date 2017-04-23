/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activessignals', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idN: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'signals',
        key: 'idN'
      }
    }
  }, {
    tableName: 'activessignals'
  });
};
