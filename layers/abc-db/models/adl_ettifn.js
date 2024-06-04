// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlEttifn = sequelize.define('AdlEttifn', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_2: {
    type: DataTypes.STRING,
    allowNull: true,

  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  operando: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valido_de: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validez_a: {
    type: DataTypes.DATE,
    allowNull: false,
  },  
  valor_de_registro: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }, 
  valor_a_calcular: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },  
  importe: {
    type: DataTypes.FLOAT,
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
  tableName: 'adl_ETTIFN'
});

AdlEttifn.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlEttifn };
