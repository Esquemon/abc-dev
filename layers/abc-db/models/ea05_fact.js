const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js');
const { Upload } = require('./upload.js');

const Ea05Fact = sequelize.define('Ea05Fact', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  validador_facturacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_calculo: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nro_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  importe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: Upload,
      key: 'id',
    },
  },
},{
  tableName: 'ea05_fact'
});

Ea05Fact.belongsTo(Upload, { foreignKey: 'id_cargas' });

module.exports = { Ea05Fact };
