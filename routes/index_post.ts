///<reference path='../express-validator.d.ts' />
///<reference path='./index.ts' />

import dao = require("../src/dao");
import api = require("../routes/api");
var index = require("./index");
var util = require('util');
var expressValidator = require('express-validator');


export function go(req, res) {
  api.forms.validate(req, function (errors) {
    var body = req.body;
    if (errors) {
      //res.send('There have been validation errors: ' + util.inspect(errors), 400);
      //res.locals.formString = util.inspect(res.locals.form);
      res.locals.validationErrors = errors; 
      res.locals.form = body
      index.go(req, res);
    } else {
      dao.forms.save(body, function(err, item) {
        res.locals.error = err;
        if (!err) {
          res.locals.message = 'Forma została dodana';
          res.locals.savedForms = [item];
          try {
            var startDate: Date = item.startDate;
            item.startDate = startDate.getDate() + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear();
          } catch (e) {}
        }
        
        index.go(req, res);
      });
    }
  });
};
