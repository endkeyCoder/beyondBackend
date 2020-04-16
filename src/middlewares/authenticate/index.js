const jwt = require('jsonwebtoken');
const { authUser } = require('../../controllers/user');
require('dotenv/config');

async function middlewareAuthUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        const resAuthUser = await authUser(req.body);
        if(resAuthUser){
            
        }
    }

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

async function providerToken(req, res, next) {
    const { nick, password, name, email, groupId } = req.body
    const token = jwt.sign({ nick, password, name, email, groupId }, process.env.JWT_KEY)
    req.token = token;
    next();
}

function middlewareTeste(req, res, next) {
    res.send({ message: 'middleware nao deixa cadastrar hahaha' })
}

module.exports = {
    middlewareAuthUser,
    providerToken,
    middlewareTeste
}