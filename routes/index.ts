var dao = require("../src/dao");

export function go(req, res) {
  dao.getDictionaries(function (dicts) {
    res.locals.sAreas = dicts.sAreas;
    res.locals.sTypes = dicts.sTypes;
    res.locals.sOwners = dicts.sOwners;
    res.locals.sIndex = dicts.sIndex;
    
    res.locals.DISPLAY_NAME = process.env.DISPLAY_NAME;
    res.locals.TEST_INSTANCE_LINK = process.env.TEST_INSTANCE_LINK;
  
    res.render('home');
  });
};
