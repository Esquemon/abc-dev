const { Sequelize } = require('sequelize');
const {Tli} = require('../models/tli');

async function createMassiveTli(data) {
  try {
    await Tli.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
    createMassiveTli,
};
