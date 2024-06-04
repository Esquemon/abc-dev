const { Sequelize } = require('sequelize');
const {AdlEanlh} = require('../models/adl_eanlh');

async function createMassive(data) {
  try {
    await AdlEanlh.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
