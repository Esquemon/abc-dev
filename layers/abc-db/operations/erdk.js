const { Sequelize } = require('sequelize');
const {Erdk} = require('../models/erdk');

async function createMassiveErdk(data) {
  try {
    await Erdk.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveErdk,
};
