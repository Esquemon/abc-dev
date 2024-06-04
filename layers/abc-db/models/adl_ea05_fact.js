const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js');
const { AdlUpload } = require('./adl_upload.js');

const AdlEa05Fact = sequelize.define('AdlEa05Fact', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  cuenta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  verif_validez_factur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fch_documento: {
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
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_fe_cla_cal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_carga: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
},{
  tableName: 'adl_fact_EA05'
});

AdlEa05Fact.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlEa05Fact };
