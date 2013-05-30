var express = require('express');
var app = module.exports = express();
var request = require('request');
var services = require('../services');
var models = require('../models');

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


app.get('/projects', function(req, res) {
  models.Project.find({}).populate('teacher school').exec(function(err, projects){
    //fake the subtext
    var expire = true;
    var counter = 0;
    projects.forEach(function(p){
      if (expire) {
        p.subtextClass = 'ui-icon-time';
        p.subtext = 'expiring soon';
        p.suptext = '9 hours left to fund';
        expire = false;
      } else if (counter == 2) {
        p.subtextClass = 'ui-icon-leaf';
        p.subtext = 'recently added';
        p.suptext = '2 hours ago';
      } else if (counter == 4) {
        p.subtextClass = 'ui-icon-money';
        p.subtext = 'nearly funded';
        p.suptext = '15% to go';
      } else if (counter == 3 || counter == 1) { //req.session.zip && p.school.zip == req.session.zip
        p.subtextClass = 'ui-icon-map-marker';
        p.subtext = 'close to me';
        p.subtext = 'approx. 1 mile away';
      } else {
        p.subtextClass = 'ui-icon-time nonurgent';
        p.subtext = counter + ' days left'
        p.suptext = ''
      }
      counter++;
    });
    res.render('projects', {projects:projects});
  });
});

app.post('/projects', function(req, res) {
  //TODO
});


// HELPERS

function schoolsByZip(zip, res) {
  console.log("Going to fetch schools by this zip: " + zip);
  models.School.find({zip:zip}, function(err, schools) {
    if (err) return res.status(500).send(err);
    if (schools.length) return res.render('find-schools', {zip: zip, schools: schools});;

    services.schools(zip, function(err, schoolRes) {
      console.log("Here are the schools for " + zip);
      console.log(schoolRes);
      if (err) return res.status(500).send(err);
      schoolRes.forEach(function(s){
        models.School.create(s, function(err, school) {
          console.log("Just saved a school to db. Err?");
          console.log(err);
        });
      });
      res.render('find-schools', {zip: zip, schools: schoolRes});
    });

  });
}
