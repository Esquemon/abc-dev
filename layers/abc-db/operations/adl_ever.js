const { Sequelize } = require('sequelize');
const {AdlEver} = require('../models/adl_ever');

async function createMassive(data) {
  try {
    await AdlEver.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
