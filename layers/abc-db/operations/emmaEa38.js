const { Sequelize } = require('sequelize');
const {EmmaEa38} = require('../models/emmaEa38');

async function createMassiveEmmaEa38(data) {
  try {
    await EmmaEa38.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
  createMassiveEmmaEa38,
};
