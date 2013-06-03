var mongoose      = require('mongoose'),
    helpers       = require('../helpers'),
    request       = require('request'),
    fs            = require('fs'),
    plugins       = require('./plugins');

var ProductSchema = new mongoose.Schema({
  targetID          : {type:Number},
  title             : {type:String},
  description       : {type:String},
  price             : {type:String},
  quantity          : {type:Number}, //temp hack
  image             : {type:String},
  link              : {type:String}
}, {strict: true});


ProductSchema.index({targetID:1}, {unique:true, sparse:true});

ProductSchema.plugin(plugins.timestamps);
ProductSchema.plugin(plugins.hideProps, []);
ProductSchema.plugin(plugins.protectProps, ['createdAt', 'updatedAt']);


//// middleware ////

//// ANYTHING FOR A NEW USER GOES HERE!
ProductSchema.pre('save', function(next){
  if ( this.isNew) {
    console.log(this);
    var self = this;
    console.log("Trying to download " + self.image + " to: " + __dirname + '/../public/img/products/' + self.id +  '.jpg');
    request(self.image).pipe(fs.createWriteStream(__dirname + '/../public/img/products/' + self.id +  '.jpg'))
    next();
  }
  else
  {
    next();
  }
});

// ProductSchema.pre('remove', function(next) {
//   var self = this;
//   next();
// });

module.exports = ProductSchema;
