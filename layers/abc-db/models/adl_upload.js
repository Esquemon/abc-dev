const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas

const AdlUpload = sequelize.define('AdlUpload', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  proceso_adl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
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
  tableName: 'adl_cargas'
});


module.exports = { AdlUpload };
