const models = require('../../models');
const ModelPlanPayments = models.planPayments;
const { allBad, allOk, serviceError } = require('../../messages');
const { Op } = require('sequelize');

async function setPlanPayments({ dataPlanPayments = null, deletedPlanPayments = null }) {
    try {
        if (dataPlanPayments) {
            const arrayPlanPayments = dataPlanPayments.map(async planPayment => {
                const slPlanPayment = await ModelPlanPayments.findOne({
                    where: {
                        [Op.or]: [
                            { id: planPayment.id },
                            { title: planPayment.title }
                        ]
                    }
                })

                if (slPlanPayment == null) {
                    const crPlanPayment = await ModelPlanPayments.create(planPayment)
                    return crPlanPayment
                } else {
                    const putPlanPayment = await ModelPlanPayments.update(planPayment, {
                        where: {
                            [Op.or]: [
                                { id: planPayment.id },
                                { title: planPayment.title }
                            ]
                        }
                    })
                    return putPlanPayment
                }
            })

            let planPaymentDeleted = [];
            console.log('print de deletedPlanPayments em setPlanPayments => ', deletedPlanPayments)
            if (deletedPlanPayments) {
                planPaymentDeleted = deletedPlanPayments.map(async planPayment => {
                    const dlPlanPayment = await ModelPlanPayments.destroy({
                        where: {
                            title: planPayment.title
                        }
                    })
                    return dlPlanPayment
                })

            }

            return { message: allOk('Planos de pagamentos atualizados com sucesso'), data: await Promise.all(arrayPlanPayments), deleteds: await Promise.all(planPaymentDeleted) }
        } else {
            return { message: allBad('Nennhuma informação enviada para cadastrar o plano de pagamento'), data: dataPlanPayment }
        }
    } catch (error) {
        console.log('print de error em setPlanPayment => ', error)
        return { message: serviceError('Problema ao tentar cadastar plano de pagamento'), error }
    }
}

async function getAllPlanPayments() {
    try {
        const slPlanPayments = await ModelPlanPayments.findAll();
        return { message: allOk('Planos de pagamento selecionados com sucesso'), data: slPlanPayments }
    } catch (error) {
        console.log('print de error em getAllPlanPayments => ', error)
        return { message: serviceError('Problema ao tentar selecionar os planos de pagamento'), error }
    }
}

module.exports = {
    setPlanPayments,
    getAllPlanPayments
}