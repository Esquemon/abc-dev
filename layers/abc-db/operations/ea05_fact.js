const { Sequelize } = require('sequelize');
const {Ea05Fact} = require('../models/ea05_fact');

async function createMassiveEa05Fact(data) {
  try {
    await Ea05Fact.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveEa05Fact,
};
