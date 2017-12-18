const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

const serviceRoutes = require('./service-routes');

const app = express();
app.use(bodyParser.json());

app.use('/', serviceRoutes);

app.listen(process.env.PORT || 8001, () => {
    console.log('service listening');
})
