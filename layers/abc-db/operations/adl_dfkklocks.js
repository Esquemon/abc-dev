const { Sequelize } = require('sequelize');
const {AdlDfkklocks} = require('../models/adl_dfkklocks');

async function createMassive(data) {
  try {
    await AdlDfkklocks.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
