const { insertUser, selectAllUser, updateUser, deleteUserbyId } = require('../../models/user');

async function notNull(data) {
    let valuesData = Object.values(data);
    let verify = await valuesData.find(info => info == "");

    return verify;
}

async function setUser(dataUser) {
    let verify = await notNull(dataUser);
    if (verify == undefined) {
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



module.exports = {
    setUser,
    getAllUsers,
    putUser,
    delUserbyId
}