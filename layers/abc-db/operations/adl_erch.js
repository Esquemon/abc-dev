const { Sequelize } = require('sequelize');
const {AdlErch} = require('../models/adl_erch');

async function createMassive(data) {
  try {
    await AdlErch.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
