//const  sequelize  = require('../connection');
const { Sequelize } = require('sequelize');
const {Upload} = require('../models/upload');

async function getUploads() {
  try {
    const uploads = await Upload.findAll({
      order: [
        ['id', 'DESC'],
      ],
    });
    return uploads;
  } catch (error) {
    console.error('Error al obtener cargas:', error);
    throw error;
  }
}

async function getUploadsByFields(portion, day, month, year) {
  try {
    const uploads = await Upload.findAll({
      where: {
        // Your conditions go here
        porcion: {
          [Sequelize.Op.eq]: portion 
        },
        ano: {
          [Sequelize.Op.eq]: year 
        },
        mes: {
          [Sequelize.Op.eq]: month 
        },
        dia: {
          [Sequelize.Op.eq]: day 
        }
      },
      order: [
            ['id', 'DESC'],
        ],
    });
    return uploads;
  } catch (error) {
    console.error('Error al obtener las cargas:', error);
    throw error;
  }
}

async function createUpload(portion, day, month, year) {
  try {
    // Realiza la inserción y obtén el objeto User creado
    const upload = await Upload.create({
      porcion: portion,
      dia: day,
      mes: month,
      ano: year,
      proceso_emma: 'pending'
    });

    return upload;
  } catch (error) {
    console.error('Error al insertar la carga:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}

async function changeEmmaProcessStatus(id_carga, proceso_emma = 'pending') {
  try {
    await Upload.update({ proceso_emma }, {
      where: {
        id: id_carga,
      },
    });

    return true;
  } catch (error) {
    console.error('Error al cambiar el estatus del procesoemma:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}


module.exports = {
    //sequelize,
    getUploadsByFields,
    createUpload,
    getUploads,
    changeEmmaProcessStatus
};
