/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalpositionondropzone', {
    View: {
      type: DataTypes.STRING(100),
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
    PositionTop: {
      type: "DOUBLE",
      allowNull: false
    },
    PositionLeft: {
      type: "DOUBLE",
      allowNull: false
    }
  }, {
    tableName: 'signalpositionondropzone'
  });
};
