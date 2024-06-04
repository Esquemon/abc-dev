const { Sequelize } = require('sequelize');
const {AdlEa05Calc} = require('../models/adl_ea05_calc');

async function createMassive(data) {
  try {
    await AdlEa05Calc.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassive,
};
