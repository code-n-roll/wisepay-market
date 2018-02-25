const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

const marketRoutes = require('./market-routes');

const app = express();
app.use(bodyParser.json());

app.use('/', marketRoutes);

app.listen(process.env.PORT || 8000, () => {
    console.log('service listening');
})