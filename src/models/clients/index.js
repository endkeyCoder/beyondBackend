const Sequelize = require('sequelize')
const { connection } = require('../config');

const Client = connection.define('client', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rg: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

async function insertClient(dataClient) {
    try {
        const tableClient = await Client.sync();
        return Client.create(dataClient)
    } catch (error) {
        return { message: 'problema ao tentar cadastar o cliente, tente novamente mais tarde', error }
    }
}

async function selectClient(filterClient) {
    try {
        const tableClient = await Client.sync();
        if (filterClient) {
            return Client.findAll({
                where: filterClient
            });
        } else {
            return Client.findAll();
        }
    } catch (error) {
        return { message: 'problema ao tentar selecionar o(s) cliente(s), tente novamente mais tarde' }
    }
}

async function updateClient(dataClient, filterClient) {
    try {
        const tableClient = await Client.sync();
        if (filterClient) {
            return Client.update(dataClient, {
                where: filterClient
            })
        } else {
            return { message: 'nenhum cliente informado para atualização, favor relatar problema ao desenvolvedor' }
        }
    } catch (error) {
        return { message: 'problema ao tentar atualizar o(s) cliente(s), tente novamente mais tarde' }
    }
}

async function deleteClient(filterClient) {
    try {
        const tableClient = await Client.sync();
        if (filterClient) {
            return Client.destroy({
                where: filterClient
            })
        } else {
            return { message: 'nenhum cliente informado para exclusão, favor relatar problema ao desenvolvedor' }
        }
    } catch (error) {
        return { message: 'problema ao tentar deletar o(s) cliente(s), tente novamente mais tarde' }
    }
}

module.exports = {
    insertClient,
    selectClient,
    updateClient,
    deleteClient
}