require('dotenv/config');
module.exports = {
  "development": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "port": process.env.DATABASE_PORT,
    "dialect": process.env.DATABASE_DIALECT,
    "operatorsAliases": false,
    "timezone": "-03:00"
  },
  "test": {
    "username": process.env.DATABASE_TEST_USER,
    "password": process.env.DATABASE_TEST_PASSWORD,
    "database": process.env.DATABASE_TEST_NAME,
    "host": process.env.DATABASE_TEST_HOST,
    "dialect": process.env.DATABASE_TEST_DIALECT,
    "operatorsAliases": false,
    "timezone": "-03:00",
    "use_env_variable": process.env.DATABASE_URL
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false,
    "use_env_variable": process.env.DATABASE_URL
  }
}
