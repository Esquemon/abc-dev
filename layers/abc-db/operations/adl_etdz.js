const { Sequelize } = require('sequelize');
const {AdlEtdz} = require('../models/adl_etdz');

async function createMassive(data) {
  try {
    await AdlEtdz.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
