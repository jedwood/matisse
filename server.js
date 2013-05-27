var express = require('express'),
    config  = require('nconf'),
    mobile  = require('./mobile'),
    app  = express();

config.argv().env().file({ file: '../config.json' });

config.defaults({'PORT': 1337});


app.configure(function(){
  app.set('port', config.get('PORT'));
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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
