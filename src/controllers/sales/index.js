const models = require('../../models');
const ModelSales = models.Sales;
const ModelFormPayments = models.formPayments;
const ModelPlanPayments = models.planPayments;
const ModelSchedulings = models.Schedulings;
const ModelFormPaymentsSale = models.formPaymentsSale;
const sequelize = models.sequelize;
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
                    required: true
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

module.exports = {
    setSale,
    getSaleByIdScheduling
}