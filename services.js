var request  = require('request'),
    xml2js   = require('xml2js');

module.exports = {

  schools: function(zip, cb) {
    request('http://query.yahooapis.com/v1/public/yql/limechile/target-schools?zip=' + zip + '&_maxage=60480',
      function(error, response, body) {
        if (error) return cb(error)
        var parser = new xml2js.Parser();
        var schools = [];

        parser.parseString(body, function (err, result) {
          var sl = result.query.results[0].li;
          if (!sl) return cb(null, schools)
          sl.forEach(function(s){
            var school = {};
            school.name = s.a[0]._;
            school.link = s.a[0].$.href;
            school.address = s.p[0];
            schools.push(school);
          })
          cb(null, schools);
        });
    })
  },

  zipByCoords: function(lat, long, cb) {
    request('http://query.yahooapis.com/v1/public/yql/limechile/zip-by-coords?latlong=' + lat + "," + long + '&_maxage=60480&format=json',
      function(error, response, body) {
        var json = JSON.parse(body);
        console.log(json.query.results.Result);
        if (error) return cb(error)
        if (!json.query.results) return cb("error");
        cb(null, json.query.results.Result.uzip);
      }
    );
  }

}
