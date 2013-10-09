var db = require("../src/db");

export function go(req, res) {
  db.CENForm.find(function(err, items) {
    res.locals.error = err;
    res.locals.CENForms = items;
    for(var i = 0; i < items.length; ++i) {
      var item = items[i];
      var startDate: Date = item.startDate;
      item.startDate = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();
    }
    
    res.render('forms');
  });
};
