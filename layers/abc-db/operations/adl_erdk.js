const { Sequelize } = require('sequelize');
const {AdlErdk} = require('../models/adl_erdk');

async function createMassive(data) {
  try {
    await AdlErdk.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
