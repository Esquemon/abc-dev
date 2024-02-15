const { Sequelize } = require('sequelize');
const {BlockMotive} = require('../models/block_motive');

async function getBlockMotives() {
  try {
    const society = await BlockMotive.findAll();
    return society;
  } catch (error) {
    console.error('Error al obtener fechas de bloqueo:', error);
    throw error;
  }
}

module.exports = {
  getBlockMotives,
};
