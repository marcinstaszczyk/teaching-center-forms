///<reference path='../node.d.ts' />

var orm = require("orm");

// Will be set on init, null == not set.
export var Breadcrumb = null;

// Callback will be called when done.
export function init(done) {
  orm.connect(process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/postgres", function(err, db) {

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
