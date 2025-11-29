const { Sequelize } = require('sequelize');
const {AdlErchc} = require('../models/adl_erchc');

async function createMassive(data) {
  try {
    await AdlErchc.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
