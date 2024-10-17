const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialectModule: require('mysql2'),
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });