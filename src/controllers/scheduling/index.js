const models = require('../../models')
const ModelSchedulings = models.Schedulings;
const ModelUsers = models.Users;
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

async function getSchedulingsByUser(userId = null, externalUserId = null) {
    try {
        if (userId) {
            const slSchedulings = await ModelSchedulings.findAll({
                include: [
                    {
                        model: ModelUsers,
                        as: 'user',
                        required: true,
                        attributes: ['id', 'name', 'nick']
                    },
                    {
                        model: ModelUsers,
                        as: 'externalUserId',
                        required: true,
                        attributes: ['id', 'name', 'nick']
                    }
                ],
                where: {
                    userId: userId
                }
            })
            const attSchedulings = slSchedulings.map(scheduling => {
                scheduling.dataValues.externalUserName = scheduling.dataValues.externalUserId[0].name
                return scheduling
            })
            return { message: allOk('Agendamentos selecionados com sucesso'), data: attSchedulings }
        }
    } catch (error) {
        console.log('print de erro em getSchedulingsByUser => ', error)
        return { message: serviceError('Problema ao tentar consultar os agendamentos'), error }
    }
}

async function putSchedulingById(dataScheduling = null) {
    try {
        if (dataScheduling) {
            const putScheduling = await ModelSchedulings.update(dataScheduling, {
                where: { id: dataScheduling.id }
            })
            return { message: allOk('Agendamento atualizado com sucesso'), data: putScheduling }
        }
    } catch (error) {
        console.log('print de erro em putSchedulingById => ', error)
        return { message: serviceError('Problema ao tentar atualizar o agendamento'), error }
    }
}

module.exports = {
    setScheduling,
    getSchedulings,
    getSchedulingsByUser,
    putSchedulingById
}