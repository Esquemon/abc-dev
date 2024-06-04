// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlBdEl31 = sequelize.define('AdlBdEl31', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  'unidad_ lectura': {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  id_interno_lect: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  aparato: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  equipo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  numerador: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unidad_medida_calc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  motiv_lectura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  asignacion_multiple: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clase_lectura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status_lectura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valor_contador_leido: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fech_lectura: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nota_lectura: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  enteros: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  decimales: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nro_archivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  inst: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Apart: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo_tarifa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seccion: {
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
  tableName: 'adl_BD_EL31'
});

AdlBdEl31.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlBdEl31 };
