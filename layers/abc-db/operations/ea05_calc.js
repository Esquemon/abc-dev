const { Sequelize } = require('sequelize');
const {Ea05Calc} = require('../models/ea05_calc');

async function createMassiveEa05Calc(data) {
  try {
    await Ea05Calc.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveEa05Calc,
};
