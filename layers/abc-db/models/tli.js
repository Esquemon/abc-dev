// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Upload } = require('./upload.js');

const Tli = sequelize.define('Tli', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
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
  tableName: 'TLI'
});

Tli.belongsTo(Upload, { foreignKey: 'id_cargas' });

module.exports = { Tli };
