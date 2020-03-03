const jwt = require('jsonwebtoken');
require('dotenv/config');

function authUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provider' })
    }

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

async function providerToken(req, res, next) {
    const { id } = req.body
    const token = jwt.sign({ id }, process.env.JWT_KEY)
    req.token = token;
    next();
}

module.exports = {
    authUser,
    providerToken
}