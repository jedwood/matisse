var mongoose      = require('mongoose'),
    moment        = require('moment'),
    plugins       = require('./plugins');


var ProjectSchema = new mongoose.Schema({
  name              : {type: String},
  description       : {type: String},
  teacher           : {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
  school            : {type: mongoose.Schema.Types.ObjectId, ref: 'School'},
  sponsor           : {type: String},
  video             : {type: String},
  heroImage         : {type: String},
  smallImage        : {type: String},
  cost              : {type: Number},
  expiration        : {type: Date},
  amountFunded      : {type: Number},
  instructions      : {type: String},
  products          : [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  funders           : [{type: mongoose.Schema.Types.ObjectId, ref: 'Person'}],
  active            : {type: Boolean, default: true}
}, {strict: true});

ProjectSchema.plugin(plugins.timestamps);
ProjectSchema.plugin(plugins.hideProps, ['owner']);
ProjectSchema.plugin(plugins.protectProps, ['updatedAt']);

// ProjectSchema.pre('save', function(next){
//   if ( this.isNew) {
//     var self = this;
//     //TODO put the due date ahead one week.
//     next();
//   }
//   else
//   {
//     next();
//   }
// });

module.exports = ProjectSchema;
