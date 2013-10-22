///<reference path='../node.d.ts' />

var db = require("../src/db");

var dictionaries;
export function getDictionaries(done) {
  if (dictionaries) {
    done(dictionaries);
  } else {
    var dicts = {sAreas: [], sAreasSimple: [], sTypes: [], sOwners: [], sIndex: []};
    
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

        db.sOwners.find(["name"], function(err, items) {
          for (var i = 0; i < items.length; ++i) {
            dicts.sOwners[i] = items[i].name;
          }
          
          db.sIndex.find(function(err, items) {
            for (var i = 0; i < items.length; ++i) {
              dicts.sIndex[i] = items[i].name;
            }
            
            dictionaries = dicts;
            
            done(dictionaries);
          });
        });
      });
    });
  }
}

export var forms = {
  list: formList,
  get: getForm,
  saveOrUpdate: saveOrUpdateForm
};

function formList(done) {
  db.CENForm.find(["id"], function(err, items) {
    for(var i = 0; i < items.length; ++i) {
      var item = items[i];
      var startDate: Date = item.startDate;
      item.startDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
    }
    
    done(err, items);
  });
}

function getForm(id, done) {
  db.CENForm.get(id, function(err, item) {
    console.log(item.startDate)
    done(err, item);
  });
}

function saveOrUpdateForm(form, done) {
  console.log(JSON.stringify(form));
  if (!form.id) {
    db.CENForm.create([form], function(err) {
      done(err);
    });
  } else {
    db.CENForm.get(form.id, function(err, item) {
      if (err) {
        done(err);
      } else {
        for (var attr in form) {
          if (form.hasOwnProperty(attr)) item[attr] = form[attr];
        }
        item.save(function (err) {
          done(err);
        });
      }
    });
  }
//  db.CENForm.get(id, function(err, item) {
//    done(err, item);
//  });
  //done(null);
}


