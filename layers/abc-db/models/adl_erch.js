// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlErch = sequelize.define('AdlErch', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_carga: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
  nro_doc_calc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cuenta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inicio_per_calc: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fin_per_calc: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_calc_planif: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_lect_planif: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unidad_lectura: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creado_el: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nro_doc_anual_ajus: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_clave_calc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motivo_anulacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
  tableName: 'adl_ERCH'
});

AdlErch.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlErch };
