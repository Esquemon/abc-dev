const { Sequelize } = require('sequelize');
const {AdlBdEl31} = require('../models/adl_bd_el31');

async function createMassive(data) {
  try {
    await AdlBdEl31.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
