const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js'); // Ajusta la ruta según tu estructura de carpetas

const ProcesoEmma = sequelize.define('ProcesoEmma', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_carga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ctaColectiva: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  esColectiva: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bis: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tariftyp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ableinh: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  porcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  esErdk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  esEver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  esTli: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  esTlo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reTlo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  errorCalculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apartCalculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  errorFact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apartFact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tieneBloqueo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cluster: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  obsAdicional: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monomicoKwh: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monomicoPrecio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monomicoPromedio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  facturado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asignar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  tableName: 'ProcesoEmma'
});


module.exports = { ProcesoEmma };
