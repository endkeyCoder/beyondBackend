const models = require('../../models');
const ModelSales = models.Sales;
const ModelFormPayments = models.formPayments;
const ModelPlanPayments = models.planPayments;
const ModelSchedulings = models.Schedulings;
const ModelFormPaymentsSale = models.formPaymentsSale;
const ModelUser = models.Users;
const ModelGroups = models.userGroups;
const sequelize = models.sequelize;
const { Op } = require('sequelize');
const { allOk, serviceError, allBad } = require('../../messages');

async function setSale(dataSale) {
    const { sale = undefined, formPayments = undefined } = dataSale;
    if (sale == undefined || formPayments == undefined) {
        return { message: allBad('Ausencia de informações para gravar a venda'), data: dataSale }
    } else {
        try {
            const updateScheduling = await ModelSchedulings.update({ status: sale.scheduling[0].status }, {
                where: { id: sale.schedulingId }
            })
            const recordSale = await sequelize.transaction(async (t) => {
                let idSale = 0;
                const slSale = await ModelSales.findOne({
                    where: { schedulingId: sale.schedulingId },
                }, { transaction: t })
                if (slSale == null) {
                    const crSale = await ModelSales.create(sale, { transaction: t })
                    idSale = crSale.dataValues.id
                } else {
                    const upSale = await ModelSales.update(sale, {
                        where: { id: slSale.dataValues.id }
                    }, { transaction: t })
                    idSale = slSale.dataValues.id
                }
                const slFormPaymentsSale = await ModelFormPaymentsSale.findAll({
                    where: { idSale: idSale }
                }, { transaction: t })
                if (slFormPaymentsSale.length <= 0) {
                    const crFormPaymentsSale = formPayments.map(async formPayment => {
                        formPayment.idSale = idSale;
                        return await ModelFormPaymentsSale.create(formPayment)
                    }, { transaction: t })
                } else {
                    const delFormPaymentsSale = await ModelFormPaymentsSale.destroy({
                        where: { idSale: idSale }
                    }, { transaction: t })
                    const crFormPaymentsSale = formPayments.map(async formPayment => {
                        formPayment.idSale = idSale;
                        return await ModelFormPaymentsSale.create(formPayment)
                    }, { transaction: t })
                }
            });
            return { message: allOk('As informações da venda foram gravadas com sucesso'), data: recordSale }
        } catch (error) {
            console.log('print de error em setSale => ', error)
            return { message: serviceError('Problema ao tentar gravar a venda, tente novamente'), error }
        }
    }

}

async function getSaleByIdScheduling(idScheduling) {
    try {
        const slSale = await ModelSales.findOne({
            where: { schedulingId: idScheduling },
            include: [
                {
                    model: ModelPlanPayments,
                    as: 'planPayment',
                    required: true
                },
                {
                    model: ModelSchedulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        excluded: false
                    }
                }
            ]
        })
        let slFormPaymentsSale = [];
        if (slSale !== null) {
            slFormPaymentsSale = await ModelFormPaymentsSale.findAll({
                where: { idSale: slSale.dataValues.id },
                include: [
                    {
                        model: ModelFormPayments,
                        as: 'formPayment',
                        required: true
                    }
                ]
            })

        }
        if (slSale == null) {
            return { message: allBad('Nenhuma venda encontrada para esse agendamento'), data: slSale }
        } else {
            return { message: allOk('Venda encontrada'), data: { sale: slSale, formPayments: slFormPaymentsSale } }
        }
    } catch (error) {
        console.log('print de error em getSaleByIdScheduling => ', error);
        return { message: serviceError('Problema ao carregar vendas desse agendamento'), error }
    }
}

async function getSalesByFilters({ idExternalUser = '', idGroup = '', initialDate = '', finalDate = '',
    dateScheduling = 'false', statusSale = 'vendido', queryAdvanced = {}
}) {
    try {
        let result = [];
        if (initialDate !== '' && finalDate !== '') {
            const filterSales = () => {
                const resultFilter = {}
                if (dateScheduling == 'false') {
                    resultFilter.createdAt = { [Op.between]: [`${initialDate} 00:00:00`, `${finalDate} 23:59:59`] }
                }
                if (idExternalUser !== '') {
                    resultFilter.userId = idExternalUser
                }
                return resultFilter;
            }
            const includes = () => {
                const resultIncludes = [
                    {
                        model: ModelSchedulings,
                        as: 'scheduling',
                        required: true,
                        attributes: ['id', 'createdAt', 'dateScheduling'],
                        where: {
                            status: statusSale,
                            excluded: false
                        }
                    },
                    {
                        model: ModelUser,
                        as: 'user',
                        required: true,
                        attributes: ['id', 'name', 'nick']
                    },
                    {
                        model: ModelPlanPayments,
                        as: 'planPayment',
                        required: true,
                        attributes: ['id', 'title']
                    },
                    {
                        model: ModelFormPaymentsSale,
                        as: 'formPaymentsId',
                        required: true,
                        attributes: ['id', 'value', 'entry'],
                        include: {
                            model: ModelFormPayments,
                            as: 'formPayment',
                            required: true,
                            attributes: ['id', 'title', 'rate']
                        }
                    }
                ]
                if (dateScheduling == 'true') {
                    resultIncludes.find(myInclude => myInclude.as == 'scheduling').where = {
                        dateScheduling: {
                            [Op.between]: [`${initialDate} 00:00:00`, `${finalDate} 23:59:59`]
                        }
                    }
                }

                if (idGroup !== '') {
                    resultIncludes.find(myInclude => myInclude.as == 'user').include = {
                        model: ModelGroups,
                        as: 'userGroup',
                        required: true,
                        where: {
                            id: idGroup
                        }
                    }
                }

                return resultIncludes;
            }
            const filterTotSum = () => {
                const resultTotSum = {}
                if (dateScheduling == 'false') {
                    resultTotSum.createdAt = {
                        [Op.between]: [`${initialDate} 00:00:00`, `${finalDate} 23:59:59`]
                    }
                }
                if (idExternalUser !== '') {
                    resultTotSum.userId = idExternalUser
                }
                return resultTotSum;
            }
            const includeTotSum = () => {
                const resultIncludeTotSum = [];
                resultIncludeTotSum.push({
                    model: ModelSchedulings,
                    as: 'scheduling',
                    required: true,
                    where: {
                        status: statusSale,
                        excluded: false
                    }
                })
                if (dateScheduling == 'true') {
                    resultIncludeTotSum.push({
                        model: ModelSchedulings,
                        as: 'scheduling',
                        required: true,
                        where: {
                            dateScheduling: {
                                [Op.between]: [`${initialDate} 00:00:00`, `${finalDate} 23:59:59`]
                            },
                            excluded: false
                        }
                    })
                }
                if (idGroup !== '') {
                    resultIncludeTotSum.push({
                        model: ModelUser,
                        as: 'user',
                        required: true,
                        include: {
                            model: ModelGroups,
                            as: 'userGroup',
                            required: true,
                            where: {
                                id: idGroup
                            }
                        }
                    })
                }
                return resultIncludeTotSum
            }
            const trSales = await sequelize.transaction(async (t) => {
                const slSales = await ModelSales.findAll({
                    where: filterSales(),
                    include: includes()
                }, { transaction: t })

                const totSales = await ModelSales.sum('value', {
                    where: filterTotSum(),
                    include: includeTotSum()
                }, { transaction: t })
                return { sales: slSales, totSales }
            })
            let totRates = 0;
            trSales.sales.forEach(sale => {
                sale.dataValues.formPaymentsId.forEach((infoForm, index2) => {
                    const { value } = infoForm.dataValues //valor armazenado de cada venda encontrada na consulta
                    const { rate } = infoForm.dataValues.formPayment[0] //porcentagem de taxa da forma de pagamento utilizada na venda
                    //uma vez que a taxa é configurada em porcentagem.na linha abaixo é feito o calculo do valor da taxa
                    sale.dataValues.formPaymentsId[index2].dataValues.formPayment[0].dataValues.rate = (parseFloat(value) / 100 * parseFloat(rate)).toFixed(2);
                    //totalização das taxas é armazenada na variavel totRates
                    totRates = totRates + parseFloat(sale.dataValues.formPaymentsId[index2].dataValues.formPayment[0].dataValues.rate)
                })
            })

            result = trSales
            result.totRates = totRates
            result.totLiquid = (result.totSales - result.totRates)

        } else {
            result = { message: allBad('Data de inicio e fim não informada!'), data: { initialDate, finalDate } }
        }

        return { message: allOk('Relatório gerado com sucesso'), data: result }
    } catch (error) {
        console.log('print de error em getSalesByFilters => ', error)
        return { message: serviceError('Problema ao tentar selecionar relatorio de vendas') }
    }
}


module.exports = {
    setSale,
    getSaleByIdScheduling,
    getSalesByFilters
}