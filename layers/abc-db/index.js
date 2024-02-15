// index.js
const sequelize = require('./connection');

// Carga todos los modelos
require('./models/portion');  // Ajusta según tus modelos
require('./models/society'); 
require('./models/upload');
require('./models/eanlh');
require('./models/tli');
require('./models/tlo');
require('./models/rechazoTlo');

module.exports = {
  sequelize,
  Portion,
  Society,
  Upload,
  Eanlh,
  Tli,
  Tlo,
  RechazoTlo
};
