/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalstatus', {
    idN: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'signals',
        key: 'idN'
      }
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    tableName: 'signalstatus'
  });
};
