// connection.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});
/*
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'emmadb-instance-1.c3ucayqug350.us-east-1.rds.amazonaws.com',
  username: 'adminEmma',
  password: 'jdu#$HSMsq',
  database: 'emma',
  logging: false,
});*/

module.exports = sequelize;


