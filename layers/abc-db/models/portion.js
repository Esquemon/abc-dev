// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Society } = require('./society.js');

const Portion = sequelize.define('Portion', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  id_sociedad: {
    type: DataTypes.BIGINT,
    references: {
      model: Society,
      key: 'id',
    },
  },
},{
  tableName: 'porciones'
});

Portion.belongsTo(Society, { foreignKey: 'id_sociedad' });

module.exports = { Portion };
