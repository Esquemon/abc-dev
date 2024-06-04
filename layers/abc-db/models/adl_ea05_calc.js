const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js');
const { AdlUpload } = require('./adl_upload.js');

const AdlEa05Calc = sequelize.define('AdlEa05Calc', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  cuenta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  verif_validez_calculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fch_calculo_planif: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nro_doc_calc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_fe_cla_cal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  denominacion: {
    type: DataTypes.STRING,
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
  tableName: 'adl_calc_EA05'
});

AdlEa05Calc.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlEa05Calc };
