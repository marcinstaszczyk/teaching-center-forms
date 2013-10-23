var dao = require("../src/dao");

export function go(req, res) {
  dao.forms.list(function (err, items) {
    for(var i = 0; i < items.length; ++i) {
      var item = items[i];
      var startDate: Date = item.startDate;
      item.startDate = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear();
    }
    
    res.locals.error = err;
    res.locals.CENForms = items;
    
    res.render('forms');
  });
};
