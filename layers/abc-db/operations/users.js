const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

async function createUser({ username, nombre, password, tipo }) {
  const hashed = await bcrypt.hash(password, 10);
  return User.create({
    username,
    nombre,
    password: hashed,
    tipo
  });
}

async function getUserByUsername(username) {
  return User.findOne({ where: { username } });
}

module.exports = {
  createUser,
  getUserByUsername
};
