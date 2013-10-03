var orm = require("orm");

// Will be set on init, null == not set.
module.exports.Breadcrumb = null;

// Callback will be called when done.
module.exports.init = function(done) {
  orm.connect("sqlite://breadcrumbs.db3", function(err, db) {
    var Breadcrumb = db.define("breadcrumb", {
      date : Date,
      latitude : Number,
      longitude : Number,
      address : String,
    });
    
    // Make the database.
    Breadcrumb.sync(function(err) {});
    
    if (err) {
      done("Error: could not create the database: " + err);
    } else {
      // Export our object for basic interactions.
      module.exports.Breadcrumb = Breadcrumb;
      // We're done.
      done(null);
    }
  });
};