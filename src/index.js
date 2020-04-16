const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { loadSettings } = require('./middlewares/settings');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loadSettings);
app.use(routes);


app.listen(3333);