const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas

const ClasificationType = sequelize.define('ClasificationType', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_clasificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },

},{
  tableName: 'tipo_clasificacion'
});


module.exports = { ClasificationType };
