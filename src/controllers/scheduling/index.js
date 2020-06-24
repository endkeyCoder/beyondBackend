const models = require('../../models')
const ModelSchedulings = models.Schedulings;
const ModelUsers = models.Users;
const ModelSales = models.Sales;
const { allOk, allBad, serviceError, notFound } = require('../../messages');
const { Op } = require('sequelize');

async function setScheduling(dataScheduling) {
    try {
        if ('userId' in dataScheduling) {
            const resInsertSchedule = await ModelSchedulings.create(dataScheduling);
            const slExternalUser = await ModelUsers.findOne({
                where: { id: resInsertSchedule.dataValues.externalUser }
            })
            resInsertSchedule.dataValues.externalUserName = slExternalUser.name;
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

async function getSchedulingsbyDateRange({ initialDate = null, finalDate = null, idExternalUser = null }) {
    try {
        if (initialDate !== null && finalDate !== null && idExternalUser !== null) {
            const slSchedulings = await ModelSchedulings.findAll({
                where: {
                    dateScheduling: {
                        [Op.between]: [initialDate, finalDate]
                    },
                    externalUser: idExternalUser
                },
            })
            if (slSchedulings.length <= 0) {
                return { message: allOk('Nenhum agendamento encontrado'), data: slSchedulings }
            } else {
                return { message: allOk('Agendamentos selecionados com sucesso'), data: slSchedulings }
            }
        } else {
            return { message: allBad('Filtro inválido para selecionar agendamentos'), data: { initialDate, finalDate } }
        }
    } catch (error) {
        console.log('print de error em getSchedulingsbyDateRange => ', error)
        return { message: serviceError('Problema para selecionar os agendamentos por data'), error }
    }
}

async function getSchedulingsByFilters({
    initialDate = '',
    finalDate = '',
    userId = 0,
    all = 'false',
    idScheduling = 0,
    client = '',
    typeDate = 'dateScheduling'
}) {
    try {
        if (initialDate !== "" && finalDate !== "") {
            let slSchedulings = [];
            if (all == 'true') {
                slSchedulings = await ModelSchedulings.findAll({
                    where: {
                        [typeDate]: {
                            [Op.between]: [initialDate, `${finalDate} 23:59:59`]
                        },
                        [Op.or]: [
                            { id: idScheduling },
                            {
                                client: {
                                    [Op.like]: `${client}%`
                                }
                            }
                        ]
                    },
                    include: {
                        model: ModelUsers,
                        as: 'user',
                        required: true,
                        attributes: ['name']
                    }
                })
            } else {
                slSchedulings = await ModelSchedulings.findAll({
                    where: {
                        [typeDate]: {
                            [Op.between]: [initialDate, `${finalDate} 23:59:59`]
                        },
                        userId: userId,
                        [Op.or]: [
                            { id: idScheduling },
                            {
                                client: {
                                    [Op.like]: `${client}%`
                                }
                            }
                        ]
                    },
                    include: {
                        model: ModelUsers,
                        as: 'user',
                        required: true,
                        attributes: ['name']
                    }
                })
            }
            if (slSchedulings.length <= 0) {
                return { message: allOk('Nenhum agendamento encontrado'), data: slSchedulings }
            } else {
                return { message: allOk('Agendamentos selecionados com sucesso'), data: slSchedulings }
            }
        } else {
            return { message: allBad('A data inicial e final devem ser informadas'), data: { initialDate, finalDate } }
        }
    } catch (error) {
        console.log('print de error em getSchedulingsByFilters => ', error)
        return { message: serviceError('Problema ao tentar selecionar agendamentos') }
    }
}

async function putScheduling(id = '', data = '') {
    try {
        if (id !== '' && data !== '') {
            const updateScheduling = await ModelSchedulings.update(data, {
                where: { id }
            })
            return { message: allOk('O agendamento foi atualizado com sucesso!'), data: { id, data }, queryResult: updateScheduling }
        } else {
            return { message: allBad('Informações insuficientes para realizar a atualização do agendamento'), data: { id, data } }
        }
    } catch (error) {
        return { message: serviceError('Problema ao tentar atualizar o agendamento'), error, data: { id, data } }
    }
}

async function delScheduling(id = '') {
    try {
        if (id !== '') {
            const deleteScheduling = await ModelSchedulings.destroy({
                where: { id }
            })
            return { message: allOk('O arquivo foi excluído com sucesso'), queryResult: deleteScheduling, data: { id } }
        }
        else {
            return { message: allBad('Informações insuficientes para realizar a exclusão do agendamento'), data: { id } }
        }
    } catch (error) {
        console.log('print de error em delScheduling => ', error)
        return { message: serviceError('Problema ao tentar excluir o agendamento'), error, data: { id } }
    }
}

module.exports = {
    setScheduling,
    getSchedulings,
    getSchedulingsByUser,
    putSchedulingById,
    getSchedulingsbyDateRange,
    getSchedulingsByFilters,
    putScheduling,
    delScheduling
}