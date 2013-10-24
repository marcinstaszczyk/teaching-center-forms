///<reference path='../node.d.ts' />

import db = require("../src/db");

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
  getByUUID: getFormByUUID,
  saveOrUpdate: saveOrUpdateForm,
  save: save,
  remove: removeForm
};

function formList(done) {
  db.CENForm.find(["id"], function(err, items) {
    for(var i = 0; i < items.length; ++i) {
      prepareLoadedData(items[i]);
    }
    done(err, items);
  });
}

function getForm(id, done) {
  db.CENForm.get(id, function(err, item) {
    prepareLoadedData(item);
    done(err, item);
  });
}

function getFormByUUID(uuid, done) {
  db.CENForm.find({uuid: uuid}, 1, function(err, items) {
    if (err, !items || items.length == 0) {
      done(err, null)
      return;
    }
    prepareLoadedData(items[0]);
    done(err, items[0]);
  });
}

function prepareLoadedData(item) {
  if (item) {
    if (item.indexMerged) {
      item.index = item.indexMerged.split(":;:");
    }
  }
}

function saveOrUpdateForm(form, done) {
  console.log(JSON.stringify(form));
  if (!form.id) {
    save(form, done);
  } else {
    db.CENForm.get(form.id, function(err, item) {
      if (err) {
        done(err);
      } else {
        copyAndPrepareDataToSave(form, item);
        item.save(function (err, item) {
          prepareLoadedData(item);
          done(err, item);
        });
      }
    });
  }
}

function save(form, done) {
  var item = copyAndPrepareDataToSave(form, {});
  item.uuid = generateUUID();
  
  db.CENForm.create(item, function(err, item) {
    prepareLoadedData(item);
    done(err, item);
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function copyAndPrepareDataToSave(form, to) {
  for (var attr in form) {
    if (form.hasOwnProperty(attr)) to[attr] = form[attr];
  }
  if (form.startDateConverted) {
    to.startDate = form.startDateConverted;
  }
  if (form.index) {
    if (Array.isArray(form.index)) {
      var merge = "";
      for(var i = 0; i < form.index.length; ++i) {
        if (i != 0) {
          merge += ":;:";
        }
        merge += form.index[i];
      }
      to.indexMerged = merge;
    } else {
      to.indexMerged = form.index;
    }
  } 
  return to;
}

function removeForm(id, done) {
  db.CENForm.get(id, function(err, item) {
    if (err) {
      done(err);
    } else {
      item.remove(function (err) {
        done(err);
      });
    }
  });
}

var MAX_LOGIN_TRIES = 10;
export function login(login, hash, done) {
  db.CENUser.find({login: login}, 1, function (err, users) {
    if (err) {
      done(err);
    } else if (!users || users.length == 0) {
      done('noUser');//Nie znaleziono użytkownika
    } else {
      var user = users[0];
      if (user.password == hash && user.errCount < MAX_LOGIN_TRIES) {
        user.errCount = 0;
        user.save(function (err, item) {
          item.password = '*********';
          done(err, item);
        });
      } else {
        user.errCount = user.errCount + 1;
        user.save(function (err, item) {
          done((user.errCount > MAX_LOGIN_TRIES ? 'locked' : 'passErr') + (err ? err : ''));
        });
      }
    }
  });
}

