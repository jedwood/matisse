var mongoose  = require('mongoose');

// require in models and schema here.
exports.Person  = mongoose.model('Person', require('./person'));
exports.Project = mongoose.model('Project', require('./project'));
exports.School = mongoose.model('School', require('./school'));
