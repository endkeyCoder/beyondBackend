const models = require('../../models');
const modelEntities = models.Entities;
const { setPermissionsDefault } = require('../permissions');
const { serviceError, allOk, notFound } = require('../../messages');
const dataEntities = [
    {
        name: 'schedulings',
        auxiliaryName: 'Agendamentos'
    },
    {
        name: 'users',
        auxiliaryName: 'Usuários'
    },
    {
        name: 'usergroups',
        auxiliaryName: 'Grupos de usuário'
    },
    {
        name: 'settings',
        auxiliaryName: 'Configurações'
    },
    {
        name: 'audit',
        auxiliaryName: 'Auditoria'
    }
]

async function insertEntities() {
    try {
        const resInsertEntities = dataEntities.map(async entity => {
            const slEntities = await modelEntities.findOne({
                where: { name: entity.name }
            })

            if (slEntities == null) {
                const crEntities = await modelEntities.create(entity);
                const crPermissions = await setPermissionsDefault({ allPermissions: false }, null, crEntities.dataValues.id);
                return crEntities
            }
        })
        const resultInsertEntities = await Promise.all(resInsertEntities)
        return { message: allOk('Entidades foram gravadas com sucesso'), data: resultInsertEntities };
    } catch (error) {
        console.log('print de erro em insertEntities => ', error)
        return { message: serviceError('Falha ao carregar as configurações inciais do sistema'), error }
    }
}

async function getEntitiesById(id) {
    try {
        const slEntities = await modelEntities.findAll({
            where: { id: id }
        })
        if (slEntities === null) {
            return { message: notFound('Nenhuma funcionalidade registrada para o grupo desse usuário') }
        } else {
            return { message: allOk('Funcionalidades encontradas') }
        }
    } catch (error) {
        console.log('print de erro em insertEntities => ', error)
        return { message: serviceError('Falha ao carregar as funcionalidades, tente fazer login novamente'), error }
    }
}

async function getAllEntities() {
    try {
        const slEntities = await modelEntities.findAll();
        return { message: allOk('Entidades selecionadas com sucesso'), data: slEntities }
    } catch (error) {
        console.log('print de error em getAllEntities => ', error)
        return { message: serviceError('Falha ao carregar as funcionalidades, tente fazer login novamente'), error }
    }
}

module.exports = {
    insertEntities,
    getEntitiesById,
    getAllEntities
}