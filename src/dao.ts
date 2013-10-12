///<reference path='../node.d.ts' />

var db = require("../src/db");

var dictionaries;
export function getDictionaries(done) {
  if (dictionaries) {
    done(dictionaries);
  } else {
    var dicts = {sAreas: [], sAreasSimple: [], sTypes: [], sOwners: []};
    
    db.sAreas.find(function(err, items) {
      var lastGroup: Array = null;
      for (var i = 0; i < items.length; ++i) {
        if (items[i].group) {
          lastGroup = [];
          dicts.sAreas.push({ name: items[i].name, sub: lastGroup });
        } else {
          lastGroup.push(items[i].name);
          dicts.sAreasSimple.push(items[i].name);
        }
      }

      db.sTypes.find(function(err, items) {
        for (var i = 0; i < items.length; ++i) {
          dicts.sTypes[i] = items[i].name;
        }


        db.sOwners.find(function(err, items) {
          for (var i = 0; i < items.length; ++i) {
            dicts.sOwners[i] = items[i].name;
          }
          
          dictionaries = dicts;
          
          done(dictionaries);
        });
      });
    });
  }
}

export function getForms(done) {
  db.CENForm.find(function(err, items) {
    for(var i = 0; i < items.length; ++i) {
      var item = items[i];
      var startDate: Date = item.startDate;
      item.startDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
    }
    
    done(err, items);
  });
}
