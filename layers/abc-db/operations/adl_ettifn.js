const { Sequelize } = require('sequelize');
const {AdlEttifn} = require('../models/adl_ettifn');

async function createMassive(data) {
  try {
    await AdlEttifn.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
