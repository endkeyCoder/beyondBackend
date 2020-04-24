const models = require('../../models');
const ModelFormPayments = models.formPayments
const { allOk, allBad, serviceError } = require('../../messages');
async function setFormPayments({ dataFormPayments: dataFormPayment, deletedFromPayments }) {
    try {
        if (dataFormPayment) {
            const arrayFormPayments = dataFormPayment.map(async formPayment => {
                const slFormPayments = await ModelFormPayments.findOne({
                    where: { title: formPayment.title }
                })
                if (slFormPayments == null) {
                    if ('id' in formPayment) {
                        const putFormPayment = await ModelFormPayments.update(formPayment, {
                            where: { id: formPayment.id }
                        })
                        return putFormPayment
                    } else {
                        const crFormPayment = await ModelFormPayments.create(formPayment);
                        return crFormPayment;
                    }
                } else {
                    const putFormPayment = await ModelFormPayments.update(formPayment, {
                        where: { id: slFormPayments.dataValues.id }
                    })
                    return putFormPayment
                }
            })

            let formPaymentsDeleted = [];

            if (deletedFromPayments) {
                formPaymentsDeleted = deletedFromPayments.map(async formPayment => {
                    const dlFormPayment = await ModelFormPayments.destroy({
                        where: { title: formPayment.title }
                    })
                    return dlFormPayment
                })
            }

            return { message: allOk('Formas de pagamentos atualizadas com sucesso'), data: await Promise.all(arrayFormPayments), deleteds: await Promise.all(formPaymentsDeleted) }
        } else {
            return { message: allBad('Nenhuma informação encontrada para cadasto da forma de pagamento'), data: dataFormPayment }
        }
    } catch (error) {
        console.log('print de error em setFormPayment => ', error)
        return { message: serviceError('Problema ao tentar cadastrar forma de pagamento'), error, request: dataFormPayment }
    }
}

async function getAllFormPayments() {
    try {
        const slFormPayments = await ModelFormPayments.findAll();
        const changeDatatypes = slFormPayments.map(formPayment => {
            formPayment.rate = parseFloat(formPayment.rate)
            return formPayment
        })
        return { message: allOk('Formas de pagamento selecionadas com sucesso'), data: changeDatatypes }
    } catch (error) {
        console.log('print de error em getAllFormPayments => ', error)
        return { message: serviceError('Problema ao tentar selecioanar formas de pagamentos'), error }
    }
}

module.exports = {
    setFormPayments,
    getAllFormPayments
}