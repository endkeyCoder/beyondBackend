const models = require('../../models');
const ModelUsers = models.Users;
const ModelGroups = models.userGroups;
const { providerToken } = require('../uteis');
const { getPermissionsById } = require('../permissions');
const { Op, Model } = require('sequelize');
const { notFound, serviceError, allOk, allBad } = require('../../messages');
const apiEmail = require('../../config/axios');
const crypto = require('crypto');
const { allowedNodeEnvironmentFlags } = require('process');
const sequelize = models.sequelize;

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
                nick: nick, password: password, block: false, excluded: false
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
            return { message: allBad('Usuário/Senha inválidos e/ou usuário bloqueado'), data: dataUser }
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
            attributes: { exclude: ['password'] },
            where: {
                excluded: false
            },
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
            attributes: { exclude: ['password'] },
            where: {
                excluded: false
            }
        })
        return { message: allOk('Usuários selecionados com sucesso'), data: slUsers }
    } catch (error) {
        console.log('print de error em getAllUsers => ', error);
        return { message: serviceError('Problema ao tentar selecionar usuários'), error }
    }
}

async function generateAutoPassword(data) {
    try {
        const hash = crypto.createHash('md5').update(data).digest('hex')
        return hash.slice(0, 10)
    } catch (error) {
        return 'Nunca mais vou esquecer minha senha';
    }
}

async function forgotPassword({ email }) {
    try {
        const newPass = await generateAutoPassword(email);
        const updatePassword = await ModelUsers.update({ password: newPass }, {
            where: { email }
        })
        if (updatePassword[0] == 1) {
            const resSendEmail = await apiEmail.post('/sendMail', {
                transporter: {
                    host: process.env.MAIL_TRANSPORTER_SMTP,
                    port: process.env.MAIL_TRANSPORTER_PORT,
                    secure: Boolean(process.env.MAIL_TRANSPORTER_SECURE),
                    auth: {
                        user: process.env.MAIL_TRANSPORTER_USER,
                        pass: process.env.MAIL_TRANSPORTER_PASSWORD
                    }
                },
                sender: {
                    from: process.env.MAIL_SENDER_FROM,
                    to: email,
                    subject: 'Você esqueceu sua senha!',
                    text: `Uma nova senha foi cadastrada automaticamente para acessar o sistema, é recomendado realizar a alteração da senha assim que acessar novamente o sistema\n\n Nova senha: ${newPass}`
                }
            })

            return { message: allBad('Verificar retorno no envio de email'), data: resSendEmail.data }
        } else {
            return { message: notFound('Email não encontrado'), data: email }
        }
    } catch (error) {
        console.log('print de error em forgotPassword => ', error)
        return { message: serviceError('Problema com a função esqueci a senha'), error }
    }
}

async function changePassword(idUser = '', newPassword = '', oldPassword) {
    try {
        if (idUser !== '' && newPassword !== '' && oldPassword !== '') {
            const execChangePassword = await sequelize.transaction(async (t) => {
                const slLogin = await ModelUsers.findOne({
                    where: { id: idUser, password: oldPassword }
                }, { transaction: t })
                if (slLogin !== null) {
                    const updatePassword = await ModelUsers.update({ password: newPassword }, {
                        where: { id: idUser, password: oldPassword }
                    }, { transaction: t })
                    return { message: allOk('A senha foi alterada com sucesso'), data: newPassword }
                } else {
                    return { message: allBad('A senha atual está incorreta'), data: oldPassword }
                }
            })
            return { data: execChangePassword };
        }
    } catch (error) {
        console.log('print de error em changePassword => ', error)
        return { message: serviceError('Problema ao tentar alterar a senha'), error }
    }
}

async function getUsersByGroup(idGroup = '') {
    try {
        if (idGroup !== '') {
            const slUsers = await ModelUsers.findAll({
                where: {
                    groupId: idGroup,
                    excluded: false
                },
                include: {
                    model: ModelGroups,
                    as: 'userGroup',
                    required: true,
                    attributes: ['name', 'id']
                }
            })
            return { message: allOk('Usuários encontrados com sucesso'), data: slUsers }
        } else {
            return { message: allBad('Grupo nao informado para seleção de usuários') }
        }
    } catch (error) {
        console.log('print de error em getUserByGroup => ', error);
        return { message: serviceError('Problema ao tentar consultar usuarios por grupo'), error }
    }
}

async function blockUser(id) {
    try {
        const trBlockUser = await sequelize.transaction(async (t) => {
            const slUser = await ModelUsers.findOne({
                where: {
                    id
                }
            }, { transaction: t })
            if (slUser !== null) {
                const { block } = slUser.dataValues
                const updateUser = await ModelUsers.update({ block: !block }, {
                    where: {
                        id
                    }
                }, { transaction: t })
            } else {
                return { message: allBad('usuário nao encontrado') }
            }
        })
        return { message: allOk('usuário alterado com sucesso'), data: trBlockUser }
    } catch (error) {
        console.log('print de error em blockUser => ', error)
        return { message: serviceError('Problema ao bloquear/desbloquear o usuário'), error }
    }
}

async function putUser(id, data) {
    try {
        const updateUser = await ModelUsers.update(data, {
            where: {
                id
            }
        })
        return { message: allOk('Usuário alterado com sucesso'), data: updateUser }
    } catch (error) {
        console.log('print de error em putUser => ', error)
        return { message: serviceError('Problema ao tentar alterar as informações do usuário'), error }
    }
}

async function delUser(id) {
    try {
        const delUser = await ModelUsers.update({ excluded: true, block: true }, {
            where: {
                id
            }
        })
        return { message: allOk('Usuário excluido com sucessso'), data: delUser }
    } catch (error) {
        console.log('print de error em delUser => ', error)
        return { message: serviceError('Problema ao tentar exlcuir o usuario') }
    }
}

async function recoverUser(id) {
    try {
        const resRecUser = await ModelUsers.update({ excluded: false }, {
            where: {
                id
            }
        })
        return { message: allOk('Usuário recuperado com sucesso'), data: resRecUser }
    } catch (error) {
        console.log('print de error em recoverUser', error)
        return { message: serviceError('Problema ao recuperar usuário'), error }
    }
}

module.exports = {
    setUser,
    login,
    getExternalUsers,
    getAllUsers,
    forgotPassword,
    changePassword,
    getUsersByGroup,
    blockUser,
    putUser,
    delUser,
    recoverUser
}