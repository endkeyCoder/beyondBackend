const models = require('../../models');
const ModelSales = models.Sales;
const ModelPrices = models.prices;
const ModelSchedulings = models.Schedulings;
const ModelProducts = models.products;
const ModelProductSales = models.productSales;
const sequelize = models.sequelize;
const { Op } = require('sequelize');
const { serviceError, allBad, allOk } = require('../../messages');

//importações de funções internas
const { calcTotSales, calcNetSale } = require('../sales');
const { parse } = require('dotenv/lib/main');

async function getComissions({ initialDate = '', finalDate = '', userId = '', groupId = '' }) {
    try {
        if (initialDate == '' || finalDate == '') {
            return { message: allBad('Datas de inicio e fim não informadas'), data: { initialDate, finalDate } }
        } else {

        }
    } catch (error) {

    }
}

async function getComissionByUserId({ id, initialDate, finalDate }) {
    //Esse vai ser usado pra tela inicial do sistema
    try {
        let resultCommission = {
            message: {},
            data: {
                sales: [
                    {
                        id: 0,
                        commission: 0,
                        date: '',
                        infoSale: {
                            client: '',
                            address: '',
                            contact: '',
                            observation: ''
                        }
                    }
                ],
                totCommission: 0
            }
        };
        const trComission = await sequelize.transaction(async (t) => { // a função precisa retornar comissão de vendas por produto, precisa fazer uma nova tabela pra salvar produtos relacionados a venda
            const slSales = await ModelSales.findAll({
                where: {
                    userId: id,
                    createdAt: {
                        [Op.between]: [initialDate, `${finalDate} 23:59:59`]
                    }
                },
                include: [
                    {
                        model: ModelProductSales,
                        as: 'productsSale',
                        required: true
                    }
                ]
            }, { transaction: t })
            if (slSales.length > 0) {

                resultCommission.message = allOk('Vendas consultadas com sucesso')
                resultCommission.data.sales = await Promise.all(slSales.map(async sale => {
                    const { value: valueSale, createdAt, scheduling, id, observation, productsSale } = sale.dataValues;
                    const netSale = await calcNetSale(id);
                    console.log('print de netSale => ', netSale)
                    const VComissions = await Promise.all(productsSale.map(async (prodSale) => {
                        return await calcCommission(prodSale.idProduct, netSale)
                    }))
                    const totCommissions = VComissions.reduce((sum, value) => {
                        return sum + parseFloat(value)
                    }, 0)
                    return { id, commission: totCommissions, date: createdAt, details: 'pensando ..' }
                }))

                resultCommission.data.totCommission = calcTotCommissions(resultCommission.data.sales.map(sale => sale.commission))
            } else {
                resultCommission.message = allBad('Nenhuma venda encontrada');
                resultCommission.data = slSales
            }
        })
        return resultCommission;
    } catch (error) {
        console.log('print de error em getComissionByUserId => ', error)
        return { message: serviceError('Problema ao tentar consultar comissão e suas variaveis') }
    }
}

//funções internas
async function calcCommission(idProduct, valueSale) {
    try {
        let VComission = 0;
        const slPrices = await ModelPrices.findAll({
            attributes: ['value', 'commission'],
            order: [
                ['value', 'DESC']
            ],
            where: {
                id_product: idProduct
            },
            include: {
                model: ModelProducts,
                as: 'product',
                required: true
            }
        })

        if (slPrices.length > 0) {
            const MAX_VALUE_COMMISSION = parseFloat(slPrices[0].value);
            const abovePrice = slPrices[0].product[0].aboutPrice;

            if (valueSale > MAX_VALUE_COMMISSION) {
                const addComission = ((valueSale - MAX_VALUE_COMMISSION) / 100) * parseFloat(abovePrice)
                VComission = VComission + addComission;
            }
            let dataCommission = slPrices.find((price) => {
                return parseFloat(price.value) <= valueSale
            })
            if (dataCommission == undefined) {
                dataCommission = slPrices[slPrices.length - 1]
            }
            const { commission: PComission } = dataCommission;
            VComission = (VComission + ((MAX_VALUE_COMMISSION / 100) * PComission)).toFixed(2);
            return VComission;
        } else {
            console.log('print de Nenhum preço configurado para esse produto')
            return 0;
        }
    } catch (error) {
        console.log('print de error em calcComission => ', error)
        return { error }
    }
}

function calcTotCommissions(arrCommissions = []) {
    return arrCommissions.reduce((sum, commission) => {
        return (parseFloat(sum) + parseFloat(commission)).toFixed(2);
    })
}


module.exports = {
    getComissions,
    getComissionByUserId
}