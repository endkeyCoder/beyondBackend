const Sequelize = require('sequelize');
const { connection } = require('../config');
const Op = Sequelize.Op

const User = connection.define('user', {
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    group: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

async function insertUser(dataUser) {
    try {
        const tableUser = await User.sync();
        return User.create(dataUser)
    } catch (error) {
        return { message: 'problema ao tentar salvar novo usuario', error }
    }
}

async function selectAllUser() {
    try {
        const tableUser = await User.sync();
        return User.findAll()
    } catch (error) {
        return { message: 'problema ao tentar selecionar todos os usuários', error }
    }
}

async function deleteUserbyId(idUser) {
    try {
        const tableUser = await User.sync();
        return User.destroy({
            where: {
                id: idUser
            }
        })
    } catch (error) {
        return { message: `problema ao tentar excluir as informações do usuário: ${idUser}`, error }
    }
}

async function updateUser(dataUser) {
    try {
        const tableUser = await User.sync();
        return User.update(dataUser, {
            where: {
                id: dataUser.id
            }
        })
    } catch (error) {
        return { message: 'problema ao tentar atualizar informações do usuário', error }
    }
}

async function login(dataAuth) {
    try {
        const tableUser = await User.sync();
        return User.findOne({
            where: {
                [Op.and]: [
                    { user: dataAuth.user },
                    { password: dataAuth.password }
                ]
            }
        })
    } catch (error) {
        return { message: 'problema ao tentar realizar login', error }
    }
}



module.exports = {
    connection,
    insertUser,
    selectAllUser,
    deleteUserbyId,
    updateUser,
    login
}