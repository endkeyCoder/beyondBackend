/*const { notNull } = require('../uteis')
const { insertGroup, selectAllGroups, updateGroup } = require('../../models/groups');
const { insertTransactionGroup } = require('../../models/permissions');
const { setPermissionsDefault } = require('../permissions');

async function setGroup(dataGroup) {
    try {
        const verify = await notNull(dataGroup);

        if (verify) {
            const { data, options } = dataGroup;
            const resultGroup = await insertGroup(data);
            console.log('print de resultGroup em setGroup => ', resultGroup)
            if (resultGroup.error) {
                return resultGroup;
            } else {
                const { id } = resultGroup.dataValues;
                const resultPermissions = await setPermissionsDefault(options, id);

                return { infoGroup: resultGroup, infoPermissions: resultPermissions }
            }

        } else {
            return {
                message: 'Todas as informações devem ser preenchidas',
                statusCode: 400,
            }
        }
    } catch (error) {
        console.log('print de error, controller grupo', error)
        return {
            message: 'Houve um problema ao tentar criar o grupo',
            statusCode: 400,
            error
        }
    }
}

async function setTransactionGroup(dataGroup) {
    try {
        const verify = await notNull(dataGroup);

        if (verify) {
            const resultGroup = await insertTransactionGroup(dataGroup);
            return resultGroup;
        } else {
            return {
                message: 'Todas as informações devem ser preenchidas',
                statusCode: 400,
            }
        }
    } catch (error) {
        console.log('print de error, controller grupo', error)
        return {
            message: 'Houve um problema ao tentar criar o grupo',
            statusCode: 400,
            error
        }
    }
}

async function putGroup(dataGroup) {
    const { data, condition } = dataGroup;
    if (!condition) {
        return {
            message: "nenhuma condição informada para realizar a atualização do grupo",
            errorCode: "400"
        }
    }
    try {
        const response = await updateGroup(data, condition);
        return response;
    } catch (error) {
        return {
            message: 'Houve um problema ao tentar atualizar os grupos',
            errorCode: 400,
            error
        }
    }
}

module.exports = {
    setGroup,
    getAllGroups,
    putGroup,
    setTransactionGroup
}*/

const models = require('../../models');
const { setPermissionsDefault, getPermissionsById } = require('../permissions');
const ModelUserGroup = models.userGroups;
const { allOk, notFound, serviceError } = require('../../messages');
async function setUserGroup(dataUserGroup) {
    try {
        const { data, options } = dataUserGroup;
        const slUserGroup = await ModelUserGroup.findOne({
            where: { name: data.name }
        })

        if (slUserGroup == null) {
            const crUserGroup = await ModelUserGroup.create(data);
            const crPermission = await setPermissionsDefault(options, crUserGroup.dataValues.id);
            return { message: allOk('Grupo de usuário criado com sucesso'), data: crUserGroup, permissions: crPermission }
        } else {
            const slPermissions = await getPermissionsById(slUserGroup.id);
            return { message: 'Grupo de usuário já existe', data: slUserGroup, permissions: slPermissions }
        }
    } catch (error) {
        console.log('print de erro em setUserGroup => ', error)
        return { message: 'Problema ao cadastrar grupo de usuário' }
    }
}

async function getUserGroupsById(id) {
    try {
        const slUserGroup = await ModelUserGroup.findOne({
            where: { id: id }
        })
        if (slUserGroup !== null) {
            return { message: allOk('O grupo de usuários foi selecionado com sucesso'), data: slUserGroup }
        } else {
            return { message: notFound('O grupo de usuários não foi encontrado'), data: slUserGroup }
        }
    } catch (error) {
        console.log('print de erro em getUserGroupsById => ', error)
        return { message: serviceError('Problema ao tentar selecionar o gupo de usuários') }
    }
}

async function getAllUserGroups() {
    try {
        const slUserGroups = await ModelUserGroup.findAll();
        if (slUserGroups.length > 0) {
            return { message: allOk('Grupos carregados com sucesso'), data: slUserGroups };
        } else {
            return { message: notFound('Nenhum grupo cadastrado') };
        }
    } catch (error) {
        return {
            message: serviceError('Problema ao tentar carregar os gruposo de usuário'),
            error
        }
    }
}

async function putUsergroup(dataUserGroup) {
    try {
        const upUsergroup = await ModelUserGroup.update(dataUserGroup, {
            where: {
                id: dataUserGroup.id
            }
        })
        return { message: allOk('Informações do grupo alteradas com sucesso'), data: upUsergroup }
    } catch (error) {
        console.log('print de error em putGroup => ', error)
        return { message: serviceError('Problema ao tentar alterar informações do grupo'), error }
    }
}

module.exports = {
    setUserGroup,
    getUserGroupsById,
    getAllUserGroups,
    putUsergroup
}