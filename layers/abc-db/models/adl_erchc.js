// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlErchc = sequelize.define('AdlErchc', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_carga: {
    type: DataTypes.BIGINT,
    references: {
      model: AdlUpload,
      key: 'id',
    },
  },
  nro_doc_impresion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nro_doc_calc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  anulacion_ajuste: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  tableName: 'adl_ERCHC'
});

AdlErchc.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlErchc };
