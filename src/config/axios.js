const axios = require('axios');

const apiEmail = axios.create({
    baseURL: 'https://krwebservices.herokuapp.com',
    timeout: 20000
})

module.exports = apiEmail