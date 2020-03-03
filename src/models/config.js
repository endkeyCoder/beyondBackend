const Sequelize = require('sequelize');
require('dotenv/config');

const connection = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: process.env.DATABASE_DIALECT
    }
)

async function connectDatabase() {
    
    try {
        const result = await connection.authenticate();
        return { message: 'conexão com o banco de dados realizada com sucesso', connection, details: result }
    } catch (error) {
        return { message: 'poblema ao tentar conectar com o banco e dados', error }
    }
}

module.exports = {
    connectDatabase,
    connection
}