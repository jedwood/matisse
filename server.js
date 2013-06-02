var express  = require('express'),
    config   = require('nconf'),
    mobile   = require('./mobile'),
    mongoose = require('mongoose'),
    app  = express();

config.argv().env().file({ file: './config.json' });

config.defaults({'PORT': 1337, 'MONGOURL': 'mongodb://localhost/matisse'});


// RedisStore = require("connect-redis")(express);

// var redis;
// var rdstore;
// if (config.get('REDISTOGO_URL')) {
//   var rtg   = require("url").parse(config.get('REDISTOGO_URL'));
//   redis = require("redis").createClient(rtg.port, rtg.hostname);
//   redis.auth(rtg.auth.split(":")[1]);
//   rdstore = new RedisStore({ host:rtg.hostname, port: rtg.port, client: redis });
//   console.log("rockin the RedisToGo");
// } else {
//   redis = require("redis").createClient();
//   rdstore = new RedisStore();
// }
// redis.on("connect", function(err) {
//   console.log("Redis connection successful.");
// });
// redis.on("error", function(err) {
//   console.log("Error " + err);
// });

mongoose.connect(config.get('MONGOURL'), function (err, res) {
  if (err) {
    console.log ('ERROR connecting to Mongo: ' + err);
  } else {
    console.log ('Mongo connection successful.');
  }
});

app.configure(function(){
  app.set('port', config.get('PORT'));
  app.use(express.static('public'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // app.use(express.session({
  //     secret: config.get('SESSIONSECRET'),
  //     store: rdstore
  // }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.use(mobile);

app.listen(app.get('port'), function(){
  console.log("Matisse listening on port " + config.get('PORT') + ', running in ' + app.settings.env + " mode, Node version is: " + process.version);
});
