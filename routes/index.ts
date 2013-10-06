var db = require("../src/db");

export var sAreas = null;
export var sAreasSimple = null;
export var sTypes = null;
export var sOwners = null;

export function go(req, res) {
  if (sOwners) {
    afterItemsLoaded(req, res);
  } else {
    db.sAreas.find(function(err, items) {
      var tmpAreas = [];
      var tmpAreasSimple = [];
      var lastGroup : Array = null;
      for (var i = 0; i < items.length; ++i) {
        if (items[i].group) {
          lastGroup = [];
          tmpAreas.push({ name: items[i].name, sub: lastGroup});
        } else {
          lastGroup.push(items[i].name);
          tmpAreasSimple.push(items[i].name);
        }
      }
      sAreas = tmpAreas;
      sAreasSimple = tmpAreasSimple;
      
      
      db.sTypes.find(function(err, items) {
        var tmpTypes = [];
        for (var i = 0; i < items.length; ++i) {
          tmpTypes[i] = items[i].name;
        }
        sTypes = tmpTypes;
        
        
        db.sOwners.find(function(err, items) {
          var tmpOwners = [];
          for (var i = 0; i < items.length; ++i) {
            tmpOwners[i] = items[i].name;
          }
          sOwners = tmpOwners;
          
          
          afterItemsLoaded(req, res);
        });
      });
    });
  }
};

function afterItemsLoaded(req, res) {
  db.CENForm.find(function(err, items) {
    res.locals.error = err;
    res.locals.sAreas  = sAreas;
    res.locals.sTypes  = sTypes;
    res.locals.sOwners = sOwners;
    res.locals.CENForm = items;
    
    res.render('home');
  });
}