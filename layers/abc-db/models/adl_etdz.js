// Dentro del archivo user.js en la carpeta models
const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas
const { AdlUpload } = require('./adl_upload.js');

const AdlEtdz = sequelize.define('AdlEtdz', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numerador: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  validez_a: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  valido_de: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nro_logico_numerador: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_de_sector: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  ident_numerador: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  factor_de_numerador: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },  
  tipo_numerador: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  num_ener_react_act: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  um_lectura: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comp_acum: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aparato: {
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
  tableName: 'adl_ETDZ'
});

AdlEtdz.belongsTo(AdlUpload, { foreignKey: 'id_carga' });

module.exports = { AdlEtdz };
