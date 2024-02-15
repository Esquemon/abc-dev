// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { Upload } = require('./upload.js');
const { Society } = require('./society.js');

const Ever = sequelize.define('Ever', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caract_determ_cta: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  grupo_verificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imputacion_co: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cuenta_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  fecha_alta: {
    type: DataTypes.DATE,
    allowNull: false,
  },  
  fecha_baja: {
    type: DataTypes.DATE,
    allowNull: false,
  }, 
  updated: {
    type: DataTypes.DATE,
    allowNull: true,
  },  
  motivo_bloqueo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: Upload,
      key: 'id',
    },
  },
  id_sociedad: {
    type: DataTypes.BIGINT,
    references: {
      model: Society,
      key: 'id',
    },
  },
},{
  tableName: 'EVER'
});

Ever.belongsTo(Upload, { foreignKey: 'id_cargas' });
Ever.belongsTo(Society, { foreignKey: 'id_sociedad' });

module.exports = { Ever };
