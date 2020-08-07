const models = require('../../models');
const ModelProducts = models.products;
const ModelPrices = models.prices;
const { allBad, allOk, serviceError } = require('../../messages');
const sequelize = models.sequelize;

async function setProduct({ product, prices }) {
    try {
        const filter = () => { // se o produto já tem um id, a função deve encontrar o produto pelo id e atualizar, caso nao encontre deve criar um novo produto
            if ('id' in product) {
                return { id: product.id }
            } else {
                return { title: product.title }
            }
        }
        if (product && prices) {
            let dataSetProducts = {};
            const trProducts = await sequelize.transaction(async (t) => {
                let idProduct = 0;
                const slProduct = await ModelProducts.findOne({
                    where: filter()
                }, { transaction: t })
                if (slProduct == null) {
                    const crProduct = await ModelProducts.create(product, { transaction: t })
                    idProduct = crProduct.dataValues.id;
                    dataSetProducts = crProduct
                } else {
                    idProduct = slProduct.dataValues.id;
                    const updateProduct = await ModelProducts.update(product, {
                        where: {
                            id: idProduct
                        }
                    }, { transaction: t })
                    dataSetProducts = updateProduct
                }
                const slPrices = await ModelPrices.findAll({
                    where: {
                        id_product: idProduct
                    }
                }, { transaction: t })
                if (slPrices.length > 0) {
                    const delPrices = await ModelPrices.destroy({
                        where: {
                            id_product: idProduct
                        }
                    }, { transaction: t })
                }
                const crPrices = await Promise.all(prices.map(async price => {
                    price.id_product = idProduct
                    price.id = undefined; //o id deve ser gerado diretamente pela função, sendo que se o campo for enviado deve ser desconsiderado
                    return await ModelPrices.create(price, { transaction: t })
                }, { transaction: t }))
                dataSetProducts.prices = crPrices;
            })
            return { message: allOk('Produto cadastrado com sucesso'), data: dataSetProducts }
        } else {
            console.log(product, prices)
            return { message: allBad('Informações insuficientes para realizar o cadastro'), data: { product, prices } }
        }
    } catch (error) {
        console.log('print de error em setProduct => ', error)
        return { message: serviceError('Problema ao tentar cadastrar o produto'), error }
    }
}

async function getAllProducts() {
    try {
        const slProducts = await ModelProducts.findAll({
            attributes: ['id', 'title', 'description', 'aboutPrice'],
            where: {
                excluded: false
            },
            include: {
                model: ModelPrices,
                as: 'price',
                required: true
            }
        });
        return { message: allOk('Consulta de produtos realizada com sucesso'), data: slProducts }
    } catch (error) {
        console.log('print de error em getAllProducts => ', error)
        return { message: serviceError('Problema ao tentar consultar os produtos'), error }
    }
}

async function delProduct(id) {
    try {
        const delProduct = await ModelProducts.update({ excluded: true }, {
            where: {
                id
            }
        })
        return { message: allOk('produto excluido com sucesso'), data: delProduct }
    } catch (error) {
        console.log('print de error em delProduct => ', error)
        return { message: serviceError('Problema ao tentar excluir o produto'), error }
    }
}

module.exports = {
    setProduct,
    getAllProducts,
    delProduct
}