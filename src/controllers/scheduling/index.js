const models = require('../../models')
const ModelSchedulings = models.Schedulings;
const { allOk, allBad, serviceError, notFound } = require('../../messages');

async function setScheduling(dataScheduling) {
    try {
        if ('userId' in dataScheduling) {
            const resInsertSchedule = await ModelSchedulings.create(dataScheduling);
            return { message: allOk('Agendamento cadastrado com sucesso'), data: resInsertSchedule };
        } else {
            return { message: notFound('Nenhum usuário logado, realize logine tente novamente'), data: dataScheduling }
        }
    } catch (error) {
        console.log('print de error em setScheduling => ', error)
        return { message: serviceError('Problema ao tentar gravar o agendamento'), error }
    }
}

async function getSchedulings(options = {}) {
    try {
        const slSchedulings = await ModelSchedulings.findAll();
        if (slSchedulings !== null) {
            return { message: allOk('Agendamentos carregados com sucesso'), data: slSchedulings }
        } else {
            return { message: notFound('Nenhum agendamento encontrado') }
        }
    } catch (error) {
        console.log('print de erro em getSchedulings => ', error)
        return { message: serviceError('Problema ao tentar consultar os agendamentos'), error }
    }
}

module.exports = {
    setScheduling,
    getSchedulings
}