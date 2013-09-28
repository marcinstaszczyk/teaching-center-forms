var request = require("request");
var db = require("../src/db");
var index = require("./index");

// Proxy through YQL.
var whereURL = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from geo.placefinder where gflags="R" and text="{LAT},{LON}"';

// express extends the Node concept of request/response HTTP architecture,
// but also keeps true to the basic idea.
var revgeo = function(lat, lon, callback) {
  var url = whereURL.replace("{LAT}", lat).replace("{LON}", lon);

  request(url, function(error, response, contentBody) {
    // Attempt to build the interpoloated address, or fail.
    var address;
    try {
      address = JSON.parse(contentBody).query.results.Result;
      address = Array.isArray(address) ? address[0] : address;
      address = address.line1 + " " + address.line2;
    } catch (e) {
      callback("Could not retrieve the location at " + lat + ", " + lon);
      return;
    }

    if (error || response.statusCode != 200) {
      callback("Error contacting the reverse geocoding service.");
    } else {
      // Save an address.
      db.Breadcrumb.create([ {
        date : new Date(),
        latitude : lat,
        longitude : lon,
        address : address
      } ], function(err, items) {
        // err - description of the error or null
        // items - array of inserted items
        // Pass back both err and address at this point.
        callback(err, address);
      });
    }
  });
};

module.exports = function(req, res) {
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  revgeo(latitude, longitude, function(err, address) {
    // diagnostic
    console.log(latitude, longitude, err, address);

    res.locals.location = {
        latitude : latitude,
        longitude : longitude,
        address : address
      };
    
    index(req, res);
  });
};