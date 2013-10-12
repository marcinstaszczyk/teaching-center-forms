///<reference path='../node.d.ts' />

var orm = require("orm");

// Will be set on init, null == not set.
export var sAreas = null;
export var sTypes = null;
export var sOwners = null;
export var CENForm = null;

// Callback will be called when done.
export function init(done) {
  var url: String = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";
  url = url.replace(":5432", "");//"orm" lub "pg" ma problem z połączeniem jesli post 5432 jest podany eksplicite
  
  orm.connect(url, function(err, db) {
    
    if (err) {
      console.log("Error connecting to DB: " + err);
      done("Error connecting to DB: " + err);
      return;
    }
    
    sAreas = db.define("s_areas", {
      name      : { type: "text", size: 255 },
      group     : Boolean
    });
    
    sTypes = db.define("s_types", {
      name      : { type: "text", size: 255 },
    });
    
    sOwners = db.define("s_owners", {
      name      : { type: "text", size: 255 },
    });
    
    CENForm = db.define("cen_form", {
      area      : { type: "text", size: 255 },
      name      : { type: "text", size: 255 },
      scope     : { type: "text", size: 255 },
      target    : { type: "text", size: 510 },
      type      : { type: "text", size: 255 },
      hours     : { type: "number", rational: false },
      startDate : { type: "date", time: false },
      owner     : { type: "text", size: 255 },
      teacher   : { type: "text", size: 255 },
      payment   : { type: "number" },
      addInfo   : { type: "text", size: 2048 },
    });

    // Make the database.
    sAreas.sync(function(err) {});
    sTypes.sync(function(err) {});
    sOwners.sync(function(err) {});
    CENForm.sync(function(err) {});
    
    // Export our object for basic interactions.
    module.exports.sAreas = sAreas;
    module.exports.sTypes = sTypes;
    module.exports.sOwners = sOwners;
    module.exports.CENForm = CENForm;
    
    // We're done.
    done(null);
  });
};
