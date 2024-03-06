// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas

const Regularizados = sequelize.define('Regularizados', {
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
  procesado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
},{
  tableName: 'regularizados'
});

module.exports = { Regularizados };
