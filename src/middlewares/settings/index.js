const { insertEntities } = require('../../controllers/entities');
const { serviceError } = require('../../messages');
const loadSettings = async function (req, res, next) {
    try {
        await insertEntities();
        next();
    } catch (error) {
        console.log('print erro em middleware => ', error);
        res.send({ message: serviceError('Problema ao carregar as configurações iniciais do sistema') })
    }
}


module.exports = {
    loadSettings
}