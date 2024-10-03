const { Sequelize } = require("sequelize");
require("dotenv").config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  port: PGPORT || 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // This enables SSL
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  },
});

module.exports = sequelize;
