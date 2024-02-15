const { Sequelize } = require('sequelize');
const {EmmaEa26} = require('../models/emmaEa26');

async function createMassiveEmmaEa26(data) {
  try {
    await EmmaEa26.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveEmmaEa26,
};
