/*const { insertUser, selectAllUser, updateUser, deleteUserbyId, selectUserByFilter } = require('../../models/user');
const { getPermissionsByIdGroup } = require('../permissions');
const bcrypt = require('bcrypt');
const { notNull, providerToken } = require('../uteis');

async function setUser(dataUser) {
    let verify = await notNull(dataUser);
    if (verify) {
        //dataUser.password = await bcrypt.hash(dataUser.password, 8);//cria um hash da senha
        
        let resInsertUser = await insertUser(dataUser);
        if (!resInsertUser.error) {
            console.log('print de resInsertUser => ', resInsertUser);
            const { nick, name, email, groupId } = resInsertUser.dataValues;
            resInsertUser.dataValues.token = providerToken({ nick, name, email, groupId });
            resInsertUser.dataValues.password = undefined; //não retorna a senha após o cadastro
            resInsertUser.dataValues.statusCode = 200;
            return resInsertUser;
        } else {
            return resInsertUser;
        }

    } else {
        return { message: 'Contain invalid fields', statusCode: 400 }
    }
}

async function getAllUsers() {
    const resSelectAllUser = await selectAllUser();
    return resSelectAllUser;
}

async function putUser(dataUser) {
    const resUpdateUser = await updateUser(dataUser);
    return resUpdateUser;
}


async function delUserbyId(idUser) {
    const resDeleteUserByID = await deleteUserbyId(idUser);
    return resDeleteUserByID;
}

module.exports = {
    setUser,
    getAllUsers,
    putUser,
    delUserbyId,
    signin
}*/

const models = require('../../models');
const ModelUsers = models.Users;
const ModelGroups = models.userGroups;
const { providerToken } = require('../uteis');
const { getPermissionsById } = require('../permissions');
const { Op } = require('sequelize');
const { notFound, serviceError, allOk, allBad } = require('../../messages');

async function setUser(dataUser) {
    try {
        const slUser = await ModelUsers.findOne({
            where: {
                [Op.or]: [{ email: dataUser.email }, { nick: dataUser.nick }]
            }
        })
        if (slUser == null) {
            const crUser = await ModelUsers.create(dataUser);
            return { message: allOk('Novo usuário cadastrado com sucesso'), data: crUser }
        } else {
            const { name } = slUser.dataValues
            return { message: allBad('Usuário e/ou email já existe, favor escolher outro'), data: { name } }
        }
    } catch (error) {
        console.log('print de erro em setUser => ', error)
        return { message: serviceError('Problema ao tentar cadastrar um novo usuário'), error }
    }
}

async function login(dataUser) {
    try {
        const { nick, password } = dataUser;
        const slUser = await ModelUsers.findOne({
            where: {
                nick: nick, password: password
            },
            include: [
                {
                    model: ModelGroups,
                    as: 'userGroup',
                    required: true
                }
            ]
        })
        if (slUser == null) {
            return { message: allBad('Usuário/Senha inválidos'), data: dataUser }
        } else {
            const { name, email, id, nick, groupId } = slUser.dataValues
            slUser.dataValues.password = undefined;
            slUser.dataValues.token = providerToken({ name, email, id, nick })
            const slPermission = await getPermissionsById(groupId)

            return { message: allOk('Login realizado com sucesso'), data: slUser, permissions: slPermission }
        }
    } catch (error) {
        console.log('print de erro em login => ', error)
        return { message: 'Problema ao tentar logar um usuário' }
    }
}

async function getExternalUsers() {
    try {
        const slUsers = await ModelUsers.findAll({
            include: [
                {
                    model: ModelGroups,
                    as: 'userGroup',
                    required: true,
                    where: { external: true }
                }
            ]
        })
        return { message: allOk('Usuários externos selecionados com sucesso'), data: slUsers }
    } catch (error) {
        console.log('print de error em getExternalUsers => ', error);
        return { message: serviceError('Problema ao tentar selecionar usuários externos'), error }
    }
}
async function getAllUsers() {
    try {
        const slUsers = await ModelUsers.findAll({
            attributes: { exclude: ['password'] }
        })
        return { message: allOk('Usuários selecionados com sucesso'), data: slUsers }
    } catch (error) {
        console.log('print de error em getAllUsers => ', error);
        return { message: serviceError('Problema ao tentar selecionar usuários'), error }
    }
}

module.exports = {
    setUser,
    login,
    getExternalUsers,
    getAllUsers
}