var request  = require('request'),
    xml2js   = require('xml2js');

module.exports = {

  schools: function(req, res) {
    var zip = req.param('zip') || '60607';
    request('http://query.yahooapis.com/v1/public/yql/limechile/target-schools?zip=' + zip + '&_maxage=60480',
      function(error, response, body) {
        if (error) return res.status(500);
        var parser = new xml2js.Parser();
        var schoolsJSON = [];
        var schoolsHTML = '';

        parser.parseString(body, function (err, result) {
          var sl = result.query.results[0].li;
          if (!sl) return res.send("<li><strong>no schools found</strong></li>");
          sl.forEach(function(s){
            var school = {};
            school.name = s.a[0]._;
            school.link = s.a[0].$.href;
            school.address = s.p[0];
            schoolsJSON.push(school);
            schoolsHTML += '<li><strong>' + school.name + '</strong><small>' + school.address + '</small></li>';
          })
          if (req.format == "json") return res.send(schoolsJSON);
          res.send(schoolsHTML);
        });
    })
  }

}
