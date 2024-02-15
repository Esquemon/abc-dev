// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Upload } = require('./upload.js');

const Eanlh = sequelize.define('Eanlh', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bis: {
    type: DataTypes.DATE,
    allowNull: false,

  },
  tariftyp: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  ableinh: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: true,

  },
  fecha_ejecucion: {
    type: DataTypes.DATE,
    allowNull: true,

  },
  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: Upload,
      key: 'id',
    },
  },
},{
  tableName: 'EANLH'
});

Eanlh.belongsTo(Upload, { foreignKey: 'id_cargas' });

module.exports = { Eanlh };
