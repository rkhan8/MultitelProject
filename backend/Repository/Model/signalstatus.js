/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalstatus', {
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
