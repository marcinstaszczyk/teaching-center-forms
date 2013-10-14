var dao = require("../src/dao");

export function go(req, res) {
  dao.forms.list(function (err, items) {
    res.locals.error = err;
    res.locals.CENForms = items;
    
    res.render('forms');
  });
};
