var request  = require('request'),
    xml2js   = require('xml2js');

var services = module.exports = {

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
            school.name = services.stringUtils.titleCase(s.a[0]._.toLowerCase());
            school.targetLink = s.a[0].$.href;
            //var zipMatch = s.p[0].match(/(\d{5})\-\d{4}$/);
            //console.log(zipMatch);
            school.zip = parseInt(zip, 10);
            school.address = services.stringUtils.titleCase(services.stringUtils.stripStateZip(s.p[0]).toLowerCase());
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
        if (error) return cb(error)
        if (!json.query.results) return cb("error");
        cb(null, json.query.results.Result.uzip);
      }
    );
  },

  stringUtils : {

    titleCase: function(title) {
      var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
      var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
      var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;

      while (true) {
        var m = split.exec(title);

        parts.push( title.substring(index, m ? m.index : title.length)
          .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
            return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : services.stringUtils.upper(all);
          })
          .replace(RegExp("\\b" + small + "\\b", "ig"), services.stringUtils.lower)
          .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
            return punct + services.stringUtils.upper(word);
          })
          .replace(RegExp("\\b" + small + punct + "$", "ig"), services.stringUtils.upper));

        index = split.lastIndex;

        if ( m ) parts.push( m[0] );
        else break;
      }
      return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
        .replace(/(['Õ])S\b/ig, "$1s")
        .replace(/\b(AT&T|Q&A)\b/ig, function(all){
          return all.toUpperCase();
        });
    },

    lower: function(word){
      return word.toLowerCase();
    },

    upper: function(word){
      return word.substr(0,1).toUpperCase() + word.substr(1);
    },

    stripStateZip: function(adr) {
      return adr.replace(/\s,\s[A-Z]{2}\s\d{5}\-\d{4}/, '');
    }
  }

}
