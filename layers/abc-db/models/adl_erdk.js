// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlErdk = sequelize.define('AdlErdk', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_fe_cla_cal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro_doc_impresion: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  importe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cuenta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nro_documento_oficial: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fch_clave_calculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },  
  vencimiento_neto: {
    type: DataTypes.DATE,
    allowNull: false,
  }, 
  fch_documento: {
    type: DataTypes.DATE,
    allowNull: false,
  },  
  sin_liberacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documento_simulado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doc_contabilizado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creado_por: {
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
  tableName: 'adl_ERDK'
});

AdlErdk.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlErdk };
