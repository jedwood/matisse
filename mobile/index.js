var express = require('express');
var app = module.exports = express();
var services = require('../services');


app.set('views', __dirname + '/jade');
app.set('view engine', 'jade');

app.get('/find-schools', function(req, res) {
  var zip = req.query.zip || false
  if (!zip) {
    res.render('find-schools', {zip: zip, schools: []});
  } else {
    services.schools(zip, function(err, schoolRes) {
      if (err) return res.send(err);
      res.render('find-schools', {zip: zip, schools: schoolRes});
    });
  }
})

app.get('/schools', services.schools)
