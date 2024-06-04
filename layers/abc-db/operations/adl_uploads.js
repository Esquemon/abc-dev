//const  sequelize  = require('../connection');
const { Sequelize } = require('sequelize');
const {AdlUpload} = require('../models/adl_upload');

async function getUploads() {
  try {
    const uploads = await AdlUpload.findAll({
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


async function getUploadsByFields(description, day, month, year) {
  try {
    const uploads = await AdlUpload.findAll({
      where: {
        // Your conditions go here
        descripcion: {
          [Sequelize.Op.eq]: description 
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

async function createUpload(description, day, month, year) {
  try {
    // Realiza la inserción y obtén el objeto User creado
    const upload = await AdlUpload.create({
      descripcion: description,
      dia: day,
      mes: month,
      ano: year,
      proceso_adl: 'pending'
    });

    return upload;
  } catch (error) {
    console.error('Error al insertar la carga:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}

async function changeAdlProcessStatus(id_carga, proceso_adl = 'pending') {
  try {
    await AdlUpload.update({ proceso_adl }, {
      where: {
        id: id_carga,
      },
    });

    return true;
  } catch (error) {
    console.error('Error al cambiar el estatus del proceso adl:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}


module.exports = {
    //sequelize,
    getUploadsByFields,
    createUpload,
    getUploads,
    changeAdlProcessStatus
};
