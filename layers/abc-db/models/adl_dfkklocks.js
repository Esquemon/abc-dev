const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js');
const { AdlUpload } = require('./adl_upload.js');

const AdlDfkklocks = sequelize.define('AdlDfkklocks', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  cta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 
  tpo_bloq: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proceso: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  de: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  a: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  motivo_bloqueo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  identificador: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  objeto_bloqueo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_fe_cla_cal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_carga: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
},{
  tableName: 'adl_DFKKLOCKS'
});

AdlDfkklocks.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlDfkklocks };
