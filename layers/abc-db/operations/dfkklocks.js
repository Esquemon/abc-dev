const { Sequelize } = require('sequelize');
const {Dfkklocks} = require('../models/dfkklocks');

async function createMassiveDfkklocks(data) {
  try {
    await Dfkklocks.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveDfkklocks,
};
