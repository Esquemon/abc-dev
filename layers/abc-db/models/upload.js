const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas

const Upload = sequelize.define('Upload', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  proceso_emma: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ano: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  mes: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false,

  },
},{
  tableName: 'cargas'
});


module.exports = { Upload };
