const jwt = require('jsonwebtoken');
require('dotenv/config');

async function notNull(data) {
    let verify
    if (Object.keys(data).length <= 0) {
        verify = false;
    } else {
        let valuesData = Object.values(data);
        verify = await valuesData.find(info => info === "");
        if (verify == undefined) {
            verify = true;
        } else {
            verify = false;
        }
    }

    return verify;
}

function providerToken(dataUser) {
    const token = jwt.sign(dataUser, process.env.JWT_KEY, {
        expiresIn: 720
    })
    return token
}

module.exports = {
    notNull,
    providerToken
}