var express = require('express');
var app = module.exports = express();
var request = require('request');
var services = require('../services');
var models = require('../models');

app.set('views', __dirname + '/jade');
app.set('view engine', 'jade');

// ROUTES

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/feedback', function(req, res) {
  res.render('feedback');
});

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
  models.Project.find({'active':true}).sort('_id').populate('teacher school').exec(function(err, projects){
    //fake the subtext
    var expire = true;
    var counter = 0;
    projects.forEach(function(p){
      if (counter==0) p.prefetch = true;
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

app.get('/projects/:ID', function(req, res) {
  models.Project.findById(req.param('ID')).populate('teacher school').exec(function(err, proj){
  //models.Project.findById('51a77ecbf12e5a848d000002').populate('teacher school').exec(function(err, proj){
    if (err) return res.status(500).send(err);
    //TODO make this legit
    models.Product.find({}, function(err, prods) {
      if (err) return res.status(500).send(err);
      var isnew = req.query.isnew
      var teacher = req.session.teacher || false;
      //teacher = req.query.isteacher || false;
      res.render('project-detail', {p:proj, prods:prods, isnew:isnew, teacher:teacher});
    });
  });
});

app.get('/logout', function(req, res) {
  req.session.destroy(function(){
    res.send(200);
  });
});

app.get('/fund', function(req, res) {
  res.render('fund');
});

app.get('/projects/:ID/fund', function(req, res) {
  //models.Project.findById(req.param('ID')).populate('teacher school').exec(function(err, proj){
  // models.Project.findById('51a77ecbf12e5a848d000002').populate('teacher school').exec(function(err, proj){
  //   if (err) return res.status(500).send(err);
  //   //TODO make this legit
  //   models.Product.find({}, function(err, prods) {
  //     if (err) return res.status(500).send(err);
  //     res.render('project-detail', {p:proj, prods:prods});
  //   });
  // });
});

app.get('/projects/:ID/clone', function(req, res) {
  if (!req.session.teacher) return res.status(401).send("Only teachers can copy projects");
  models.Project.findById(req.param('ID')).exec(function(err, proj){
    var clone = new models.Project();
    clone.name = proj.name;
    clone.description = proj.description;
    clone.instructions = proj.instructions;
    //clone.cost = proj.cost;
    clone.school = req.session.teacher.school;
    clone.teacher = req.session.teacher._id;
    clone.active = false;
    clone.save(function(err, newp) {
      res.redirect('/projects/' + newp.id + "?isnew=true");
    });
  });
});

app.get('/teachers/new', function(req, res) {
  if (req.query.schoolid) {
    models.School.findById(req.query.schoolid, function(err, school) {
      console.log("Here's the school: " , school);
      if (err) return res.status(404).send(err);
      res.render('new-teacher', {school:school});
    });
  } else {
    res.redirect('/find-schools');
  }
});

app.post('/teachers', function(req, res) {
  models.Person.create(req.body, function(err, t) {
    req.session.teacher = t;
    req.session.save(function(err) {
      if (err) return res.status(500).send("problem saving session");
      res.redirect('/projects');
    });
  });
});

app.get('/products/:ID', function(req, res) {
  productById(req.param('ID'), res);
});


// HELPERS

function schoolsByZip(zip, res) {
  models.School.find({zip:zip}, function(err, schools) {
    if (err) return res.status(500).send(err);
    if (schools.length) return res.render('find-schools', {zip: zip, schools: schools});;

    services.schools(zip, function(err, schoolRes) {
      //console.log("Here are the schools for " + zip);
      //console.log(schoolRes);
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

function productById(pid, res) {
  models.Product.findOne({targetID:pid}, function(err, prod) {
    if (err) return res.status(500).send(err);
    if (prod) return res.send({prod: prod});

    services.products(pid, function(err, prodRes) {
      //console.log("Here is the product for " + pid);
      //console.log(prodRes);
      var item = prodRes.ItemLookupResponse.Items.Item
      if (err) return res.status(500).send(err);
      var newP = new models.Product();
      newP.targetID = pid;
      newP.title = item.ItemAttributes.Title;
      newP.description = item.Description;
      newP.link = item.DetailPageURL;
      newP.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
      newP.image = item.Images.ImageURLPattern;
      newP.save(function(err, p) {
        console.log("Just saved a product to db. Err?");
        console.log(err);
      });
      res.send({prod: newP});
    });

  });
}
