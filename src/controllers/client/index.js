const { insertClient, selectClient, updateClient, deleteClient } = require('../../models/clients');
const { notNull } = require('../uteis');

async function setClient(dataClient) {
    const verify = notNull(dataClient);
    if (verify) {
        const resInsertClient = await insertClient(dataClient);
        return resInsertClient;
    } else {
        return { message: 'todos os campos devem ser informados' }
    }
}

async function getClient(filterClient) {
    if (filterClient) {
        const resSelectClient = await selectClient(filterClient);
        return resSelectClient;
    } else {
        const resSelectClient = await selectClient();
        return resSelectClient;
    }
}

async function putClient(dataClient, filterClient) {
    if (filterClient) {
        const resUpdateClient = await updateClient(dataClient, filterClient);
        return resUpdateClient;
    } else {
        return {message: 'cliente não informado para atualização, atualize a página e tente de novo'}
    }
}

async function delClient(filterClient) {
    if (filterClient) {
        const resDeleteClient = await deleteClient(filterClient);
        return resDeleteClient;
    } else {
        return {message: 'cliente não informado para exlusão, atualize a página e tente de novo'}
    }
}

module.exports = {
    setClient,
    getClient,
    putClient,
    delClient
}