/*const { updatePermission, selectPermissionByIdGroup, insertPermission } = require('../../models/permissions');
const { selectAllEntities } = require('../../models/entities');

async function setPermissionsDefault(options, groupId) {
    const { allPermissions } = options;
    if (allPermissions == undefined) {
        allPermissions = false;
    }
    const objDefaultPermission = (entityId) => {
        return {
            add: allPermissions,
            read: allPermissions,
            update: allPermissions,
            delete: allPermissions,
            groupId: groupId,
            entityId: entityId
        }
    };
    try {
        const slEntities = await selectAllEntities();

        const arrayEntities = await slEntities.map(async (entity) => {
            return await insertPermission(objDefaultPermission(entity.id))
        })

        let result = await Promise.all(arrayEntities);
        result = result.map((arrPermission, index) => {
            return arrPermission[0]
        })

        return result;

    } catch (error) {
        console.log('print de error em setPermissionsDefault => ', error);
        return { message: 'Problema ao tentar gravar permissões em ' }
    }
}

async function setPermissions(permissions) {
    try {
        if (typeof (permissions) == 'array') {
            const result = await permissions.map(async (permission) => {
                await insertPermission(permission)
            })
            return result;
        } else if (typeof (permissions) == 'object') {
            return await insertPermission(permission);
        }
    } catch (error) {
        console.log('print de error em setPermissionsDefault => ', error);
        return { message: 'Problema ao tentar gravar permissões setPermissionsDefault' }
    }
}

async function getPermissionsByIdGroup(groupId) {
    try {
        const res = await selectPermissionByIdGroup(groupId);
        return res;
    } catch (error) {
        return { message: 'Problem to get permissions, contact to programmer', error }
    }
}

module.exports = {
    putPermission,
    getPermissionsByIdGroup,
    setPermissions,
    setPermissionsDefault
}*/
const models = require('../../models');
const ModelEntities = models.Entities;
const ModelPermissions = models.Permissions;
const ModelGroups = models.userGroups;
const { allOk, allBad, serviceError } = require('../../messages');
const { Op } = require('sequelize');

async function setPermissionsDefault(options = { allPermissions: false }, groupId = null, entityId = null) {
    try {
        const { allPermissions } = options;
        if (groupId) {
            const slEntities = await ModelEntities.findAll();
            const resModelPermission = slEntities.map(async entity => {
                const slPermission = await ModelPermissions.findOne({ where: { groupId: groupId, entityId: entity.id } })
                if (slPermission == null) {
                    const crPermission = await ModelPermissions.create({ groupId: groupId, add: allPermissions, read: allPermissions, update: allPermissions, delete: allPermissions, entityId: entity.id })
                    crPermission.dataValues.entity = [entity];
                    console.log('print de crPermission em permissionDefault => ', crPermission)
                    return crPermission;
                }
            })
            return await Promise.all(resModelPermission)
        } else if (entityId) {
            const slGroups = await ModelGroups.findAll();
            const resModelPermission = slGroups.map(async userGroup => {
                const slPermission = await ModelPermissions.findOne({
                    where: { groupId: userGroup.id, entityId: entityId },
                })
                if (slPermission == null) {
                    const crPermission = await ModelPermissions.create({ groupId: groupId, add: allPermissions, read: allPermissions, update: allPermissions, delete: allPermissions, entityId: entity.id })
                    return crPermission;
                }
            })
            return await Promise.all(resModelPermission)
        }
    } catch (error) {
        console.log('print de erro em permissions => ', error)
        return { message: 'problema ao tentar setar as permissões, favor entrar em contato com o desenvolvedor', error, statusCode: 500 }
    }
}

async function getPermissionsById(groupId = null, entityId = null) {
    try {

        if (groupId) {
            const slPermission = await ModelPermissions.findAll({
                where: { groupId: groupId },
                include: [
                    {
                        model: ModelEntities,
                        as: 'entity',
                        required: true,
                    },
                    {
                        model: ModelGroups,
                        as: 'userGroup',
                        required: true
                    }
                ],
            })

            /*const filterSlPermition = slPermission.filter(permission => {
                const arrCrud = [
                    permission.dataValues.add,
                    permission.dataValues.read,
                    permission.dataValues.update,
                    permission.dataValues.delete
                ].filter((crud) => {
                    return crud == true;
                })
                return arrCrud.length > 0;
            })*///Esse filtro passou a ser responsabilidade do frontend

            return slPermission
        }
    } catch (error) {
        console.log('print de erro em permissions => ', error)
        return { message: 'problema ao tentar selecionar as permissões, favor entrar em contato com o desenvolvedor', error, statusCode: 500 }
    }
}

async function putPermissions(dataPermissions) {
    try {
        if (dataPermissions.length > 0) {
            const updatePermissions = dataPermissions.map(async permission => {
                permission.entity = undefined;
                permission.id = undefined;
                return await ModelPermissions.update(permission, {
                    where: { groupId: permission.groupId, entityId: permission.entityId }
                })
            })
            const resUpdatePermissions = await Promise.all(updatePermissions)
            return { message: allOk('Informações alteradas com sucesso!'), data: resUpdatePermissions }

        } else {
            return { message: allBad('Nenhuma informação enviada para atualização!') }
        }
    } catch (error) {
        console.log('print de erro em putPermission => ', error)
        return { message: serviceError('Problema para atualizar permissões, tente novamente'), error }
    }
}

async function getAllPermissions() {
    try {
        const resGetAllPermissions = await ModelPermissions.findAll({
            include: [
                {
                    model: ModelGroups,
                    as: 'userGroup',
                    required: true
                }
            ]
        })
        return { message: allOk('Permissões Selecionas com sucesso'), data: resGetAllPermissions }
    } catch (error) {
        return { message: serviceError('Problema para SELECIONAR todas as permissões, tente novamente'), error }
    }
}

module.exports = {
    setPermissionsDefault,
    getPermissionsById,
    putPermissions,
    getAllPermissions
}