// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { ClasificationType } = require('./clasification_type.js');

const Clasification = sequelize.define('Clasification', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  clasificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_clasificacion_id: {
    type: DataTypes.BIGINT,
    references: {
      model: ClasificationType,
      key: 'id',
    },
  },
},{
  tableName: 'clasificacion'
});

Clasification.belongsTo(ClasificationType, { foreignKey: 'tipo_clasificacion_id' });

module.exports = { Clasification };
