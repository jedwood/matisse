var express = require('express');
var app = module.exports = express();
var services = require('../services');

app.get('/schools', services.schools)
