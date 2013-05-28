var express = require('express');
var app = module.exports = express();
var request = require('request');
var services = require('../services');

app.set('views', __dirname + '/jade');
app.set('view engine', 'jade');

// ROUTES

app.get('/find-schools', function(req, res) {
  var zip = req.query.zip || false;
  if (!zip) {
    if (req.query.lat && req.query.long) {
      services.zipByCoords(req.query.lat, req.query.long, function(err, zip) {
        if (err) return res.status(500);
        schoolsByZip(zip, res);
      });
    } else {
      res.render('find-schools', {zip: false, schools: []});
    }
  } else {
    schoolsByZip(zip, res);
  }
});


app.get('/classrooms', function(req, res) {
  //TODO change depending on whether user is logged in
  res.render('funder');
});


// HELPERS

function schoolsByZip(zip, res) {
  console.log("Going to fetch schools by this zip: " + zip);
  services.schools(zip, function(err, schoolRes) {
    console.log("Here are the schools for " + zip);
    console.log(schoolRes);
    if (err) return res.send(err);
    res.render('find-schools', {zip: zip, schools: schoolRes});
  });
}
