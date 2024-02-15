const { Sequelize } = require('sequelize');
const {BlockDate} = require('../models/block_date');

async function getBlockDates() {
  try {
    const society = await BlockDate.findAll();
    return society;
  } catch (error) {
    console.error('Error al obtener fechas de bloqueo:', error);
    throw error;
  }
}

module.exports = {
  getBlockDates,
};
