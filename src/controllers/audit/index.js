const models = require('../../models');
const ModelSales = models.Sales;
const ModelSchdulings = models.Schedulings;
const ModelUser = models.Users;
const { allOk, allBad, serviceError, notFound } = require('../../messages');
const { Op } = require('sequelize');

async function getAuditResume({ initialDate = "", finalDate = "", userId = "", groupId = "" }) {
    try {
        if (initialDate == "" || finalDate == "") {
            return { message: allBad('O período deve ser informado!'), data: { initialDate, finalDate } }
        } else {
            let averageTicket = 0;
            let percentageMadeSales = 0;
            let slAuditResume = {};
            if (userId == "" && groupId == "") {
                slAuditResume = await justDate(initialDate, finalDate);
            } else if (userId !== "") {
                slAuditResume = await withUser(initialDate, finalDate, userId);
            }
            else if (groupId !== "") {
                slAuditResume = await withGroup(initialDate, finalDate, groupId);
            }
            if (slAuditResume.totSales > 0) {
                averageTicket = slAuditResume.valueSales / slAuditResume.totSales
            } else {
                averageTicket = 0;
            }
            if (slAuditResume.totSchedulingsAttended > 0) {
                percentageMadeSales = (slAuditResume.totSales * 100) / slAuditResume.totSchedulingsAttended;
            } else {
                percentageMadeSales = 0;
            }
            slAuditResume.averageTicket = averageTicket;
            slAuditResume.percentageMadeSales = percentageMadeSales;
            return { message: allOk('Auditoria realizada com sucesso'), data: slAuditResume }
        }

    } catch (error) {
        console.log('print de error em auditResume => ', error)
        return { message: serviceError('Problema ao carregar auditoria'), error }
    }
}

async function justDate(initialDate, finalDate) {

    const slSchedulingRegister = await ModelSchdulings.findAll({
        attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
        where: {
            createdAt: {
                [Op.between]: [initialDate, finalDate]
            }
        }
    })
    const slSchedulingDirected = await ModelSchdulings.findAll({
        attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
        where: {
            dateScheduling: {
                [Op.between]: [initialDate, finalDate]
            }
        }
    })

    const qtdSchedulingsRegister = slSchedulingRegister.length;
    const qtdSchedulingDirected = slSchedulingDirected.length;
    const schedulingsAttended = slSchedulingDirected.filter(scheduling =>
        scheduling.status == 'vendido' || scheduling.status == 'não vendido'
    )
    const qtdSchedulingsAttended = schedulingsAttended.length;
    let valueSales = await ModelSales.sum('value', {
        include: {
            model: ModelSchdulings,
            as: 'scheduling',
            required: true,
            where: {
                status: 'vendido', dateScheduling: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        }
    });
    let totSales = await ModelSales.count({
        attributes: ['id'],
        include: {
            model: ModelSchdulings,
            as: 'scheduling',
            required: true,
            where: {
                status: 'vendido', dateScheduling: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        },
    });
    if (valueSales == null) {
        valueSales = 0
    }
    if (totSales == null) {
        totSales = 0
    }
    return {
        totRegisteredSchedulings: qtdSchedulingsRegister,
        totSales,
        valueSales,
        totSchedulingsAttended: qtdSchedulingsAttended,
        directedSchedulings: qtdSchedulingDirected
    }
}

async function withGroup(initialDate, finalDate, groupId) {
    try {
        const slSchedulingRegister = await ModelSchdulings.findAll({
            attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
            include: {
                model: ModelUser,
                as: 'user',
                required: true,
                where: { groupId: groupId }
            },
            where: {
                createdAt: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        })
        const slSchedulingDirected = await ModelSchdulings.findAll({
            attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
            include: {
                model: ModelUser,
                as: 'externalUserId',
                required: true,
                where: { groupId: groupId }
            },
            where: {
                dateScheduling: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        })

        const qtdSchedulingsRegister = slSchedulingRegister.length;
        const qtdSchedulingDirected = slSchedulingDirected.length;
        const schedulingsAttended = slSchedulingDirected.filter(scheduling =>
            scheduling.status == 'vendido' || scheduling.status == 'não vendido'
        )
        const qtdSchedulingsAttended = schedulingsAttended.length;
        let valueSales = await ModelSales.sum('value', {
            include: [
                {
                    model: ModelSchdulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        status: 'vendido', dateScheduling: {
                            [Op.between]: [initialDate, finalDate]
                        }
                    }
                },
                {
                    model: ModelUser,
                    as: 'user',
                    required: true,
                    where: { groupId: groupId }
                }
            ],
        });
        let totSales = await ModelSales.count({
            include: [
                {
                    model: ModelSchdulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        status: 'vendido', dateScheduling: {
                            [Op.between]: [initialDate, finalDate]
                        }
                    }
                },
                {
                    model: ModelUser,
                    as: 'user',
                    required: true,
                    where: { groupId: groupId }
                }
            ]
        });
        if (valueSales == null) {
            valueSales = 0
        }
        if (totSales == null) {
            totSales = 0
        }
        return {
            totRegisteredSchedulings: qtdSchedulingsRegister,
            totSales,
            valueSales,
            totSchedulingsAttended: qtdSchedulingsAttended,
            directedSchedulings: qtdSchedulingDirected
        }
    } catch (error) {
        console.log('print de error em withGroup => ', error);
        return { message: serviceError('Problema ao tentar selecionar auditoria por grupo'), error }
    }
}

async function withUser(initialDate, finalDate, userId) {
    try {
        const slSchedulingRegister = await ModelSchdulings.findAll({
            attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
            include: {
                model: ModelUser,
                as: 'user',
                required: true,
                where: { id: userId }
            },
            where: {
                createdAt: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        })
        const slSchedulingDirected = await ModelSchdulings.findAll({
            attributes: ['status', 'userId', 'externalUser', 'dateScheduling'],
            include: {
                model: ModelUser,
                as: 'externalUserId',
                required: true,
                where: { id: userId }
            },
            where: {
                dateScheduling: {
                    [Op.between]: [initialDate, finalDate]
                }
            }
        })

        const qtdSchedulingsRegister = slSchedulingRegister.length;
        const qtdSchedulingDirected = slSchedulingDirected.length;
        const schedulingsAttended = slSchedulingDirected.filter(scheduling =>
            scheduling.status == 'vendido' || scheduling.status == 'não vendido'
        )
        const qtdSchedulingsAttended = schedulingsAttended.length;
        let valueSales = await ModelSales.sum('value', {
            include: [
                {
                    model: ModelSchdulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        status: 'vendido', dateScheduling: {
                            [Op.between]: [initialDate, finalDate]
                        }
                    }
                },
                {
                    model: ModelUser,
                    as: 'user',
                    required: true,
                    where: { id: userId }
                }
            ]
        });
        let totSales = await ModelSales.count({
            include: [
                {
                    model: ModelSchdulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        status: 'vendido', dateScheduling: {
                            [Op.between]: [initialDate, finalDate]
                        }
                    }
                },
                {
                    model: ModelUser,
                    as: 'user',
                    required: true,
                    where: { id: userId }
                }
            ]
        });
        if (valueSales == null) {
            valueSales = 0
        }
        if (totSales == null) {
            totSales = 0
        }
        return {
            totRegisteredSchedulings: qtdSchedulingsRegister,
            totSales,
            valueSales,
            totSchedulingsAttended: qtdSchedulingsAttended,
            directedSchedulings: qtdSchedulingDirected
        }
    } catch (error) {
        console.log('print de error em withGroup => ', error);
        return { message: serviceError('Problema ao tentar selecionar auditoria por usuário'), error }
    }
}

async function getAuditDetails({ initialDate = "", finalDate = "", userId = "", groupId = "" }) {
    try {
        
    } catch (error) {

    }
}

module.exports = {
    getAuditResume
}