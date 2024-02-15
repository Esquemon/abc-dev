const { Sequelize } = require('sequelize');
const {Eanlh} = require('../models/eanlh');

async function createMassiveEanlh(data) {
  try {
    await Eanlh.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
    createMassiveEanlh,
};
