/*const { Router } = require('express');
const { setUser, getAllUsers, putUser, delUserbyId, signin } = require('./controllers/user');
const { setClient, getClient, putClient, delClient } = require('./controllers/client');

const { putPermission, getPermissionsByIdGroup } = require('./controllers/permissions');
const { setScheduling } = require('./controllers/scheduling');

//rota default
routes.get('/', async (req, res) => {
    res.send({ message: 'servidor ok' })
})


routes.get('/getAllUsers', async (req, res) => {
    const resGetAllUsers = await getAllUsers();
    res.send(resGetAllUsers);
})

routes.put('/putUser', async (req, res) => {

    const resPutUser = await putUser(req.query);
    if (typeof (resPutUser) == 'number' || resPutUser > 0) {
        res.send({ message: 'usuario atualizado com sucesso' })
    } else {
        res.send(resPutUser)
    }
})

routes.delete('/delUserById', async (req, res) => {
    const resDelUserbyId = await delUserbyId(req.query.id)
    res.send(resDelUserbyId);
})
//-------------------------------------------------------------------

//rotas relacionadas a clientes finais-------------------------------
routes.post('/setClient', async (req, res) => {
    const resSetClient = await setClient(req.body.dataClient);
    res.send(resSetClient);
})

routes.get('/getClient', async (req, res) => {
    const resGetClient = await getClient(req.body.filterClient)
    res.send(resGetClient);
})

routes.put('/putClient', async (req, res) => {
    const resPutClient = await putClient(req.body.dataClient, req.body.filterClient)
    res.send(resPutClient)
})

routes.delete('delClient', async (req, res) => {
    const resDelClient = await delClient(req.body.filterClient)
    res.send(resDelClient)
})
//-------------------------------------------------------------------
//rotas relacionas a permissioes------------------------------------
routes.put('/putPermission', async (req, res) => {
    const resPutPermission = await putPermission(req.body);
    res.send(resPutPermission);
})
routes.get('/getPermissionByGroup/:id', async (req, res) => {
    console.log('print de req em getPermissionByGroup => ',req)
    res.send({message: 'verifica onde esta o groupId no req'})
    //const resGetPermission = await getPermissionsByIdGroup()
})
//-------------------------------------------------------------------
//-------------------------------------------------------------------



routes.put('/putGroup', async (req, res) => {
    const resUpGroup = await putGroup(req.body);
    res.send(resUpGroup)
})

*/
const { Router } = require('express');
const { setUserGroup, getUserGroupsById, getAllUserGroups, putUsergroup } = require('./controllers/groups');
const { setUser, login, getExternalUsers } = require('./controllers/user');
const { getAllEntities } = require('./controllers/entities')
const { setScheduling, getSchedulings, getSchedulingsByUser } = require('./controllers/scheduling');
const { putPermissions, getAllPermissions, getPermissionsById } = require('./controllers/permissions');

const routes = Router();
//rotas relacionadas a grupos de usuarios----------------------------
routes.post('/setUserGroup', async (req, res) => {
    const resSetUserGroup = await setUserGroup(req.body);
    res.send(resSetUserGroup);
})
routes.get('/getUserGroup/:id', async (req, res) => {
    const resGetUserGroup = await getUserGroupsById(req.params.id);
    res.send(resGetUserGroup);
})
routes.get('/getAllUserGroups', async (req, res) => {
    const resGetAllUserGroups = await getAllUserGroups();
    res.send(resGetAllUserGroups)
})
routes.put('/putUsergroup', async (req, res) => {
    const resPutUsergroup = await putUsergroup(req.body);
    res.send(resPutUsergroup)
})
//-------------------------------------------------------------------
//rotas relacionadas a usuarios --------------------------------------
routes.post('/setUser', async (req, res) => {
    console.log('print em putUser => ', req)
    const resSetUser = await setUser(req.body);
    res.send(resSetUser);
})
routes.post('/login', async (req, res) => {
    const resSignin = await login(req.body);
    res.send(resSignin);
})
routes.get('/getExternalUsers', async (req, res) => {
    const resGetExternalUsers = await getExternalUsers();
    res.send(resGetExternalUsers)
})
//-------------------------------------------------------------------
//rotas relacionadas a entidades
routes.get('/getAllEntities', async (req, res) => {
    const resGetAllEntities = await getAllEntities();
    res.send(resGetAllEntities);
})
//-------------------------------------------------------------------
//rotas relacionas a agendamentos
routes.post('/setScheduling', async (req, res) => {
    const resSetScheduling = await setScheduling(req.body);
    res.send(resSetScheduling);
})
routes.get('/getSchedulings', async (req, res) => {
    const resGetSchedulings = await getSchedulings(req.body);
    res.send(resGetSchedulings);
})
routes.get('/getSchedulingsByUser/:id', async (req, res) => {
    const resGetSchedulingsByUser = await getSchedulingsByUser(req.params.id)
    res.send(resGetSchedulingsByUser);
})
//-------------------------------------------------------------------
//rotas relacionadas as permissões-----------------------------------
routes.put('/putPermissions', async (req, res) => {
    const resPutPermissions = await putPermissions(req.body)
    res.send(resPutPermissions)
})
routes.get('/getAllPermissions', async (req, res) => {
    const resGetAllPermissions = await getAllPermissions();
    res.send(resGetAllPermissions);
})
routes.get('/getPermissionsById/:id', async (req, res) => {
    const resGetPermissionsById = await getPermissionsById(req.params.id)
    res.send(resGetPermissionsById);
})
//-------------------------------------------------------------------
module.exports = routes;