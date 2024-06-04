// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlEver = sequelize.define('AdlEver', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  cta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motivo_bloqueo: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  modificado: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  id_fe_cla_cal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_carga: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
 
},{
  tableName: 'adl_EVER'
});

AdlEver.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlEver };
