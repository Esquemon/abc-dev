//const  sequelize  = require('../connection');
const {Portion} = require('../models/portion');

async function getPortions() {
  try {
    const portions = await Portion.findAll();
    return portions;
  } catch (error) {
    console.error('Error al obtener porciones:', error);
    throw error;
  }
}

module.exports = {
    //sequelize,
    getPortions,
};
