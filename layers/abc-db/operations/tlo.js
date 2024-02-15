const { Sequelize } = require('sequelize');
const {Tlo} = require('../models/tlo');

async function createMassiveTlo(data) {
  try {
    await Tlo.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
    //sequelize,
    createMassiveTlo,
};
