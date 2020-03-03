const { Router } = require('express');
const { setUser, getAllUsers, putUser, delUserbyId } = require('./controllers/user');
const { setClient, getClient, putClient, delClient } = require('./controllers/client');
const { authUser, providerToken } = require('./middlewares/authenticate');

const routes = Router();

//rota default
routes.get('/', async (req, res) => {
    res.send({ message: 'servidor ok' })
})
//rotas relacionadas a usuarios --------------------------------------
routes.post('/setUser', providerToken, async (req, res) => {
    let resSetUser = await setUser(req.body);
    resSetUser.dataValues.token = req.token;
    console.log('print de resSetUser na rota setUser', resSetUser)
    res.send(resSetUser);
})

routes.get('/getAllUsers', async (req, res) => {
    const resGetAllUsers = await getAllUsers();
    res.send(resGetAllUsers);
})

routes.put('/putUser', authUser, async (req, res) => {
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

module.exports = routes;