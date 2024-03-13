const sequelize = require('../connection.js');
const {Regularizados} = require('../models/regularizados');

async function createMassiveRegularizados(data) {
  try {
    await Regularizados.bulkCreate(data);
    console.log('Datos cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

async function processData() {
  try {
    await sequelize.query(
      `
      call emma.actualizarRegularizados();
      `
    );    
    console.log('se realizo el proceso')
    return true
   
  } catch (error) {
    console.error('Error al realizar el proceso:', error);
    throw error;
  }
}

module.exports = {
    //sequelize,
    createMassiveRegularizados,
    processData
};
