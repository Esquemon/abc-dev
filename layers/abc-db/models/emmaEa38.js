// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Upload } = require('./upload.js');
const { Clasification } = require('./clasification.js');

const EmmaEa38 = sequelize.define('EmmaEa38', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clase_mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro_mensaje: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_clasificacion: {
    type: DataTypes.BIGINT,
    references: {
      model: Clasification,
      key: 'id',
    },
  },
  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: Upload,
      key: 'id',
    },
  },
},{
  tableName: 'emma_ea38'
});

EmmaEa38.belongsTo(Upload, { foreignKey: 'id_cargas' });
EmmaEa38.belongsTo(Clasification, { foreignKey: 'id_clasificacion' });

module.exports = { EmmaEa38 };
