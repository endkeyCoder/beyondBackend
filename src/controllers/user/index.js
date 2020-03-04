const { insertUser, selectAllUser, updateUser, deleteUserbyId, login } = require('../../models/user');
const { notNull } = require('../uteis');

async function setUser(dataUser) {
    let verify = await notNull(dataUser);
    if (verify) {
        const resInsertUser = await insertUser(dataUser);
        return resInsertUser;
    } else {
        return { message: 'todos os campos devem ser informados' }
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

async function signin(dataAuth) {
    if (dataAuth) {
        let resLogin = await login(dataAuth)
        if (resLogin == null) {
            resLogin = {
                message: 'usuário ou senha incorretos',
                authenticate: false
            }
        } else {
            console.log('print de resLogin', resLogin)
            resLogin.dataValues.authenticate = true
        }
        console.log('print de resLogin', resLogin)
        return resLogin;
    } else {
        return { message: 'informações para autenticação não informadas' }
    }
}

module.exports = {
    setUser,
    getAllUsers,
    putUser,
    delUserbyId,
    signin
}