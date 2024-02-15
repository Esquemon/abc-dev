const { Sequelize } = require('sequelize');
const {Ever} = require('../models/ever');

async function createMassiveEver(data) {
  try {
    await Ever.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveEver,
};
