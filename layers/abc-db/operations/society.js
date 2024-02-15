const { Sequelize } = require('sequelize');
const {Society} = require('../models/society');

async function getSocieties() {
  try {
    const society = await Society.findAll();
    return society;
  } catch (error) {
    console.error('Error al obtener sociedades:', error);
    throw error;
  }
}

async function getSocietyByCode(code) {
  try {
    const society = await Society.findAll({
      where: {
        // Your conditions go here
        codigo: {
          [Sequelize.Op.eq]: code 
        },
       
      }
    });
    return society;
  } catch (error) {
    console.error('Error al obtener la sociedad:', error);
    throw error;
  }
}

module.exports = {
  getSocieties,
  getSocietyByCode,
};
