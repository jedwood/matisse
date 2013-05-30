var mongoose      = require('mongoose'),
    plugins       = require('./plugins');


var SchoolSchema = new mongoose.Schema({
  name              : {type: String},
  address           : {type: String},
  zip               : {type: Number},
  targetLink        : {type: String}
}, {strict: true});

SchoolSchema.index({zip:1}, {sparse:true});

SchoolSchema.plugin(plugins.timestamps);
SchoolSchema.plugin(plugins.hideProps, []);
SchoolSchema.plugin(plugins.protectProps, ['updatedAt']);

module.exports = SchoolSchema;
