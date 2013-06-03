var models = require('./models'),
    config   = require('nconf'),
    mongoose = require('mongoose')

config.argv().env().file({ file: './config.json' });
mongoose.connect(config.get('MONGOURL'))

var teachers = [
'Ms. Bovit',
'Mr. Urban',
'Mr. Stelk',
'Ms. Adler',
'Mr. Hansman',
'Ms. Strickland',
'Ms. Baker',
'Mrs. Guzman'];

var grades = [
'4th grade',
'10th grade',
'5th grade',
'9th grade',
'6th grade',
'11th grade',
'High School',
'6th - 8th grade',
'Elementary School',
'2nd grade'];

var projectNames = [
'Cookie Pan Memo Boards',
'Scale Factor MLK',
'Chicago History Stop Motion',
'Paper Landscape Mosaics',
'Pen Pal Project',
'Still Life Painting',
'Urban Art Murals',
'Mother\'s Day Gift Bags',
'Halloween Paper Plate Masks',
'Mossimo Dip-Dye'
];

var images = [
'cookiepanmemoboards.png',
'scalefactormlk.png',
'chicagohistorystopmotion.png',
'paperlandscapemosaics.png',
'penpalproject.png',
'stilllifepainting.png',
'urbanartmurals.png',
'mothersdaygiftbags.png',
'solohalloweenpaperplatemasks.png',
'mossimodipdye.png'
 ];

models.School.find({}, function(err, schools) {
  var shuff = shuffle(schools);
  for (var i=0; i<8; i++) {
    var t = new models.Person();
    t.name = teachers[i];
    t.grade = grades[i];
    t.school = shuff[i];
    t.save();
    var p = new models.Project();
    p.name = projectNames[i];
    p.smallImage = images[i];
    p.teacher = t;
    p.school = shuff[i];
    p.save();
  }
 });

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
