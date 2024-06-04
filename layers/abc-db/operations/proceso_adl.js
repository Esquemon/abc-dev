const sequelize = require('../connection');
console.log(sequelize)
const { Sequelize, DataTypes } = require('sequelize');
//const {ProcesoEmma} = require('../models/proceso_emma');



async function processData(id_carga){
  try {
    console.log('entro en processDta')
    const OutputParam = sequelize.define('OutputParam', {
      outputParam: {
        type: DataTypes.INTEGER, // Ajusta el tipo de dato según el tipo de salida de tu procedimiento almacenado
        allowNull: true // Ajusta según tus necesidades
      }
    });
    
    const result = await sequelize.query('CALL previo_proceso_adl(:inputParam, @outputParam)', {
      replacements: { inputParam: id_carga },
      type: Sequelize.QueryTypes.RAW,
      out: 'outputParam'
    });

    const result2 = await sequelize.query('CALL proceso_adl(:inputParam, @outputParam)', {
      replacements: { inputParam: id_carga },
      type: Sequelize.QueryTypes.RAW,
      out: 'outputParam'
    });

    /*const result = await sequelize.query(`
    CALL previo_proceso_adl(${id_carga}, @resultado)
    `, {
      type: sequelize.QueryTypes.RAW,
      raw: true,
  });*/
   /* const response = await sequelize.query(
      `
      CALL previo_proceso_adl(${id_carga}, @resultado)
      `
    );*/

    console.log('response previo_proceso_adl:', result)

    
   /* await sequelize.query(
      `
      delete from indice where id_carga = ${id_carga}
      `
    );*/
  } catch (error) {
    console.error('Error al realizar el proceso:', error);
    throw error;
  }
}



module.exports = {
  processData,
};
