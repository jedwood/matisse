var mongoose      = require('mongoose'),
    helpers       = require('../helpers'),
    plugins       = require('./plugins');

var PersonSchema = new mongoose.Schema({
  email             : require('./email'),
  password          : {type:String, set:helpers.saltPassword},
  name              : {type:String},
  grade             : {type:String},
  school            : {type: mongoose.Schema.Types.ObjectId, ref: 'School'},
  isAdmin           : {type: Boolean, 'default': false },
  lastLogin         : {type:Date},
  resetToken        : {type: String, 'default': ''}
}, {strict: true});

PersonSchema.virtual('username').get(function () {
  return this.email;
}).set(function(uname) {
  this.email = uname;
});

PersonSchema.index({email:1}, {unique:true, sparse:true});

PersonSchema.plugin(plugins.timestamps);
PersonSchema.plugin(plugins.hideProps, ['isAdmin', 'password', 'resetToken']);
PersonSchema.plugin(plugins.protectProps, ['createdAt', 'updatedAt', 'isAdmin', 'lastLogin', 'resetToken']);


//// middleware ////

////// ANYTHING FOR A NEW USER GOES HERE!
// PersonSchema.pre('save', function(next){
//   if ( this.isNew) {
//     var self = this;
//     next();
//   }
//   else
//   {
//     next();
//   }
// });

// PersonSchema.pre('remove', function(next) {
//   var self = this;
//   next();
// });

module.exports = PersonSchema;
