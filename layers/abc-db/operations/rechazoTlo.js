const { Sequelize } = require('sequelize');
const {RechazoTlo} = require('../models/rechazoTlo');

async function createMassiveRechazoTlo(data) {
  try {
    await RechazoTlo.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

module.exports = {
    createMassiveRechazoTlo,
};
