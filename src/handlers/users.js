const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { createUser, getUserByUsername } = require('../../layers/abc-db/operations/users'); Local testing
const { createUser, getUserByUsername } = require('/opt/operations/users');
const SECRET = process.env.JWT_SECRET;

// Función helper para parsear el body correctamente
const parseBody = (event) => {
  try {
    let body = event.body;
    
    // Si viene en Base64, decodificarlo
    if (event.isBase64Encoded) {
      body = Buffer.from(body, 'base64').toString('utf-8');
    }
    
    // Si es string, parsearlo a JSON
    if (typeof body === 'string') {
      return JSON.parse(body);
    }
    
    // Si ya es objeto, retornarlo directamente
    return body;
  } catch (error) {
    throw new Error(`Error parsing body: ${error.message}`);
  }
};

// Función helper para respuestas con CORS
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body)
});

module.exports.register = async (event) => {
  try {
    const body = parseBody(event);
    
    // Validación básica
    if (!body.username || !body.password || !body.nombre) {
      return response(400, { 
        error: 'Faltan campos requeridos: username, password, nombre' 
      });
    }

    const existingUser = await getUserByUsername(body.username);
    if (existingUser) {
      return response(409, { error: "El nombre de usuario ya existe" });
    }

    const user = await createUser(body);

    return response(200, { 
      message: "Usuario creado exitosamente", 
      user: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        tipo: user.tipo
      }
    });
    
  } catch (error) {
    console.error('Error en register:', error);
    return response(500, { error: error.message });
  }
};

module.exports.login = async (event) => {
  try {
    const body = parseBody(event);
    
    // Validación básica
    if (!body.username || !body.password) {
      return response(400, { 
        error: 'Faltan campos requeridos: username, password' 
      });
    }
    
    const user = await getUserByUsername(body.username);
    
    if (!user) {
      return response(401, { error: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    
    if (!passwordMatch) {
      return response(401, { error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        tipo: user.tipo,
        username: user.username
      },
      SECRET,
      { expiresIn: "12h" }
    );

    return response(200, { 
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        tipo: user.tipo,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return response(500, { error: error.message });
  }
};