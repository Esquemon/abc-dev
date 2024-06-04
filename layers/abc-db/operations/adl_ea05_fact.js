const { Sequelize } = require('sequelize');
const {AdlEa05Fact} = require('../models/adl_ea05_fact');

async function createMassive(data) {
  try {
    await AdlEa05Fact.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
