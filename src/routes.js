const { Router } = require('express');
const { setUserGroup, getUserGroupsById, getAllUserGroups, putUsergroup } = require('./controllers/groups');

const { setUser, login, getExternalUsers, getAllUsers, forgotPassword, changePassword } = require('./controllers/user');

const { getAllEntities } = require('./controllers/entities');

const { setScheduling, getSchedulings, getSchedulingsByUser, getSchedulingsbyDateRange,
    getSchedulingByIdOrClient, putScheduling, delScheduling } = require('./controllers/scheduling');

const { putPermissions, getAllPermissions, getPermissionsById } = require('./controllers/permissions');

const { setFormPayments, getAllFormPayments } = require('./controllers/formPayments');

const { setPlanPayments, getAllPlanPayments } = require('./controllers/planPayments');

const { setSale, getSaleByIdScheduling } = require('./controllers/sales');

const { getAuditResume } = require('./controllers/audit');

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
routes.get('/getAllUsers', async (req, res) => {
    const resGetAllUsers = await getAllUsers();
    res.send(resGetAllUsers)
})
routes.get('/forgotPassword', async (req, res) => {
    const resGetForgotPassword = await forgotPassword(req.query)
    res.send(resGetForgotPassword)
})
routes.put('/changePassword/:id', async (req, res) => {
    const { newPassword, oldPassword } = req.body
    const resChangePassword = await changePassword(req.params.id, newPassword, oldPassword);
    res.send(resChangePassword)
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
routes.get('/getSchedulingsbyDateRange', async (req, res) => {
    const resGetSchedulingsbyDateRange = await getSchedulingsbyDateRange(req.query);
    res.send(resGetSchedulingsbyDateRange)
})
routes.get('/getSchedulingByIdOrClient', async (req, res) => {
    const resGetSchedulingByIdOrClient = await getSchedulingByIdOrClient(req.query);
    res.send(resGetSchedulingByIdOrClient)
})
routes.put('/putScheduling/:id', async (req, res) => {
    const resPutScheduling = await putScheduling(req.params.id, req.body)
    res.send(resPutScheduling)
})
routes.delete('/delScheduling/:id', async (req, res) => {
    const resDelScheduling = await delScheduling(req.params.id)
    res.send(resDelScheduling)
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
//rotas relacionadas as formas de pagamento--------------------------
routes.post('/setformPayments', async (req, res) => {
    const resSetFormPayments = await setFormPayments(req.body);
    res.send(resSetFormPayments)
})
routes.get('/getAllFormPayments', async (req, res) => {
    const resGetAllFormPayments = await getAllFormPayments();
    res.send(resGetAllFormPayments)
})
//-------------------------------------------------------------------
//rotas relacionadas aos planos de pagamento-------------------------
routes.post('/setPlanPayments', async (req, res) => {

    const resSetPlanPayments = await setPlanPayments(req.body);
    res.send(resSetPlanPayments)
})
routes.get('/getAllPlanPayments', async (req, res) => {
    const resGetAllPlanPayments = await getAllPlanPayments();
    res.send(resGetAllPlanPayments)
})
//-------------------------------------------------------------------
// rotas relacionadas as vendas
routes.post('/setSale', async (req, res) => {
    const resSetSale = await setSale(req.body);
    res.send(resSetSale)
})
routes.get('/getSaleByIdScheduling/:id', async (req, res) => {
    const resGetSaleByIdScheduling = await getSaleByIdScheduling(req.params.id)
    res.send(resGetSaleByIdScheduling)
})
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//Rotas relacionadas a auditoria
routes.get('/getAuditResume', async (req, res) => {
    const resGetAuditResume = await getAuditResume(req.query)
    res.send(resGetAuditResume)
})
//-------------------------------------------------------------------
module.exports = routes;