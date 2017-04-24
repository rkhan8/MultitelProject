/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signals', {
    idN: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    Category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MinValue: {
      type: "DOUBLE",
      allowNull: false
    },
    MaxValue: {
      type: "DOUBLE",
      allowNull: false
    },
    Unity: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'signals'
  });
};
