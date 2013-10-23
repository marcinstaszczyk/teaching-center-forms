var dao = require("../src/dao");

export function go(req, res) {
  dao.getDictionaries(function (dicts) {
    res.locals.sAreas = dicts.sAreas;
    res.locals.sTypes = dicts.sTypes;
    res.locals.sOwners = dicts.sOwners;
    res.locals.sIndex = dicts.sIndex;
  
    res.render('home');
  });
};
