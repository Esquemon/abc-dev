// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Upload } = require('./upload.js');

const Erdk = sequelize.define('Erdk', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  porcion: {
    type: DataTypes.INTEGER,
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
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nro_doc_oficial: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_clave: {
    type: DataTypes.DATE,
    allowNull: false,
  },  
  vencimiento_neto: {
    type: DataTypes.DATE,
    allowNull: false,
  }, 
  fecha_documento: {
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
  cuenta_fact_col: {
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
  tableName: 'erdk'
});

Erdk.belongsTo(Upload, { foreignKey: 'id_cargas' });

module.exports = { Erdk };
