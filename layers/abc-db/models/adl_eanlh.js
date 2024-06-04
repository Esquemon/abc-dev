// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlEanlh = sequelize.define('AdlEanlh', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  validoA: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validoDe: {
    type: DataTypes.DATE,
    allowNull: false,

  },
  tariftyp: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  claseCalculo: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  unidadLectura: {
    type: DataTypes.STRING,
    allowNull: true,

  },

  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
},{
  tableName: 'adl_EANLH'
});

AdlEanlh.belongsTo(AdlUpload, { foreignKey: 'id_cargas' });

module.exports = { AdlEanlh };
