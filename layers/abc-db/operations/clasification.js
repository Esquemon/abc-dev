const { Sequelize } = require('sequelize');
const {Clasification} = require('../models/clasification');

async function getClasifications() {
  try {
    const clasifications = await Clasification.findAll();
    return clasifications;
  } catch (error) {
    console.error('Error al obtener clasificaciones:', error);
    throw error;
  }
}

module.exports = {
  getClasifications,
};
