var db = require("../src/db");

module.exports = function(req, res){
  db.Breadcrumb.find(function(err, items) {
    res.locals.error = err;
    res.locals.breadcrumbs = items;
    
    res.render('home');
  });
};