const { DataTypes } = require('sequelize');
const sequelize = require('../connection.js');
const { Upload } = require('./upload.js');
const { BlockMotive } = require('./block_motive.js');

const Dfkklocks = sequelize.define('Dfkklocks', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  instalacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motivo_bloqueo_id: {
    type: DataTypes.BIGINT,
    references: {
      model: BlockMotive,
      key: 'id',
    },
  },
  updated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  bloqueo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sub_clasificacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_cargas: {
    type: DataTypes.BIGINT,
    references: {
      model: Upload,
      key: 'id',
    },
  },
},{
  tableName: 'dfkklocks'
});

Dfkklocks.belongsTo(Upload, { foreignKey: 'id_cargas' });
Dfkklocks.belongsTo(BlockMotive, { foreignKey: 'motivo_bloqueo_id' });

module.exports = { Dfkklocks };
